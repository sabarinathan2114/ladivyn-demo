import pool from "../config/db.js";
import xlsx from "xlsx";

// @desc    Bulk upload locations and normalize
// @route   POST /api/locations/bulk-upload
// @access  Private/Admin
export const bulkUploadLocations = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let data = [];
    if (req.file.originalname.endsWith(".json")) {
      data = JSON.parse(req.file.buffer.toString());
    } else {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }

    if (!Array.isArray(data) || data.length === 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "The uploaded file is empty or invalid" });
    }

    // Clear temp table
    await connection.query("TRUNCATE TABLE geo_location");

    let successCount = 0;
    let errorLog = [];

    // 1. Bulk Insert into geo_location
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const { state_name, district_name, city_name, pincode } = row;

      if (!state_name && !district_name && !city_name && !pincode) {
        continue; // Skip empty rows
      }

      try {
        await connection.query(
          "INSERT INTO geo_location (state_name, district_name, city_name, pincode) VALUES (?, ?, ?, ?)",
          [
            state_name || null,
            district_name || null,
            city_name || null,
            pincode || null,
          ],
        );
        successCount++;
      } catch (err) {
        errorLog.push({ row: i + 2, error: err.message });
      }
    }

    // 2. Run Normalization Queries (User's logic)
    // 1. INSERT STATES
    await connection.query(`
      INSERT IGNORE INTO states (name)
      SELECT DISTINCT state_name 
      FROM geo_location
      WHERE state_name IS NOT NULL
    `);

    // 2. INSERT DISTRICTS
    await connection.query(`
      INSERT IGNORE INTO districts (name, state_id)
      SELECT DISTINCT t.district_name, s.id
      FROM geo_location t
      JOIN states s ON s.name = t.state_name
      WHERE t.district_name IS NOT NULL
    `);

    // 3. INSERT CITIES
    await connection.query(`
      INSERT IGNORE INTO cities (name, district_id)
      SELECT DISTINCT t.city_name, d.id
      FROM geo_location t
      JOIN districts d ON d.name = t.district_name
      JOIN states s ON s.id = d.state_id AND s.name = t.state_name
      WHERE t.city_name IS NOT NULL
    `);

    // 4. INSERT PINCODES
    await connection.query(`
      INSERT IGNORE INTO pincodes (pincode, city_id)
      SELECT t.pincode, c.id
      FROM geo_location t
      JOIN cities c ON c.name = t.city_name
      JOIN districts d ON d.id = c.district_id
      JOIN states s ON s.id = d.state_id
      WHERE t.pincode IS NOT NULL
    `);

    await connection.commit();
    res.json({
      message: "Bulk upload and normalization completed",
      summary: {
        total: data.length,
        success: successCount,
        failed: errorLog.length,
      },
      errors: errorLog,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Bulk Geo Upload Error:", error);
    res.status(500).json({ message: "Server error during bulk upload" });
  } finally {
    connection.release();
  }
};

// @desc    Get all states
// @route   GET /api/locations/states
// @access  Public
export const getStates = async (req, res) => {
  try {
    const [states] = await pool.query("SELECT * FROM states ORDER BY name ASC");
    res.json(states);
  } catch (error) {
    console.error("Get States Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get districts by state ID
// @route   GET /api/locations/states/:stateId/districts
// @access  Public
export const getDistricts = async (req, res) => {
  try {
    const [districts] = await pool.query(
      "SELECT * FROM districts WHERE state_id = ? ORDER BY name ASC",
      [req.params.stateId],
    );
    res.json(districts);
  } catch (error) {
    console.error("Get Districts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get cities by district ID
// @route   GET /api/locations/districts/:districtId/cities
// @access  Public
export const getCities = async (req, res) => {
  try {
    const [cities] = await pool.query(
      "SELECT * FROM cities WHERE district_id = ? ORDER BY name ASC",
      [req.params.districtId],
    );
    res.json(cities);
  } catch (error) {
    console.error("Get Cities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get pincodes by city ID
// @route   GET /api/locations/cities/:cityId/pincodes
// @access  Public
export const getPincodes = async (req, res) => {
  try {
    const [pincodes] = await pool.query(
      "SELECT * FROM pincodes WHERE city_id = ? ORDER BY pincode ASC",
      [req.params.cityId],
    );
    res.json(pincodes);
  } catch (error) {
    console.error("Get Pincodes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all districts
// @route   GET /api/locations/districts
// @access  Public
export const getAllDistricts = async (req, res) => {
  try {
    const [districts] = await pool.query(`
      SELECT d.*, s.name as state_name 
      FROM districts d
      LEFT JOIN states s ON d.state_id = s.id
      ORDER BY d.name ASC
    `);
    res.json(districts);
  } catch (error) {
    console.error("Get All Districts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all cities
// @route   GET /api/locations/cities
// @access  Public
export const getAllCities = async (req, res) => {
  try {
    const [cities] = await pool.query(`
      SELECT c.*, d.name as district_name 
      FROM cities c
      LEFT JOIN districts d ON c.district_id = d.id
      ORDER BY c.name ASC
    `);
    res.json(cities);
  } catch (error) {
    console.error("Get All Cities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all pincodes
// @route   GET /api/locations/pincodes
// @access  Public
export const getAllPincodes = async (req, res) => {
  try {
    const [pincodes] = await pool.query(`
      SELECT p.*, c.name as city_name 
      FROM pincodes p
      LEFT JOIN cities c ON p.city_id = c.id
      ORDER BY p.pincode ASC
    `);
    res.json(pincodes);
  } catch (error) {
    console.error("Get All Pincodes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a state
// @route   POST /api/locations/states
// @access  Private/Admin
export const createState = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query("INSERT INTO states (name) VALUES (?)", [
      name,
    ]);
    res.status(201).json({ id: result.insertId, message: "State created" });
  } catch (error) {
    console.error("Create State Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a state
// @route   PUT /api/locations/states/:id
// @access  Private/Admin
export const updateState = async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query("UPDATE states SET name = ? WHERE id = ?", [
      name,
      req.params.id,
    ]);
    res.json({ message: "State updated" });
  } catch (error) {
    console.error("Update State Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a state
// @route   DELETE /api/locations/states/:id
// @access  Private/Admin
export const deleteState = async (req, res) => {
  try {
    await pool.query("DELETE FROM states WHERE id = ?", [req.params.id]);
    res.json({ message: "State deleted" });
  } catch (error) {
    console.error("Delete State Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a district
// @route   POST /api/locations/districts
// @access  Private/Admin
export const createDistrict = async (req, res) => {
  const { name, state_id } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO districts (name, state_id) VALUES (?, ?)",
      [name, state_id],
    );
    res.status(201).json({ id: result.insertId, message: "District created" });
  } catch (error) {
    console.error("Create District Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a district
// @route   PUT /api/locations/districts/:id
// @access  Private/Admin
export const updateDistrict = async (req, res) => {
  const { name, state_id } = req.body;
  try {
    await pool.query(
      "UPDATE districts SET name = ?, state_id = ? WHERE id = ?",
      [name, state_id, req.params.id],
    );
    res.json({ message: "District updated" });
  } catch (error) {
    console.error("Update District Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a district
// @route   DELETE /api/locations/districts/:id
// @access  Private/Admin
export const deleteDistrict = async (req, res) => {
  try {
    await pool.query("DELETE FROM districts WHERE id = ?", [req.params.id]);
    res.json({ message: "District deleted" });
  } catch (error) {
    console.error("Delete District Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a city
// @route   POST /api/locations/cities
// @access  Private/Admin
export const createCity = async (req, res) => {
  const { name, district_id } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO cities (name, district_id) VALUES (?, ?)",
      [name, district_id],
    );
    res.status(201).json({ id: result.insertId, message: "City created" });
  } catch (error) {
    console.error("Create City Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a city
// @route   PUT /api/locations/cities/:id
// @access  Private/Admin
export const updateCity = async (req, res) => {
  const { name, district_id } = req.body;
  try {
    await pool.query(
      "UPDATE cities SET name = ?, district_id = ? WHERE id = ?",
      [name, district_id, req.params.id],
    );
    res.json({ message: "City updated" });
  } catch (error) {
    console.error("Update City Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a city
// @route   DELETE /api/locations/cities/:id
// @access  Private/Admin
export const deleteCity = async (req, res) => {
  try {
    await pool.query("DELETE FROM cities WHERE id = ?", [req.params.id]);
    res.json({ message: "City deleted" });
  } catch (error) {
    console.error("Delete City Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a pincode
// @route   POST /api/locations/pincodes
// @access  Private/Admin
export const createPincode = async (req, res) => {
  const { pincode, city_id } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO pincodes (pincode, city_id) VALUES (?, ?)",
      [pincode, city_id],
    );
    res.status(201).json({ id: result.insertId, message: "Pincode created" });
  } catch (error) {
    console.error("Create Pincode Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a pincode
// @route   PUT /api/locations/pincodes/:id
// @access  Private/Admin
export const updatePincode = async (req, res) => {
  const { pincode, city_id } = req.body;
  try {
    await pool.query(
      "UPDATE pincodes SET pincode = ?, city_id = ? WHERE id = ?",
      [pincode, city_id, req.params.id],
    );
    res.json({ message: "Pincode updated" });
  } catch (error) {
    console.error("Update Pincode Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a pincode
// @route   DELETE /api/locations/pincodes/:id
// @access  Private/Admin
export const deletePincode = async (req, res) => {
  try {
    await pool.query("DELETE FROM pincodes WHERE id = ?", [req.params.id]);
    res.json({ message: "Pincode deleted" });
  } catch (error) {
    console.error("Delete Pincode Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
