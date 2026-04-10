import pool from '../backend/src/config/db.js';

async function testNormalization() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    console.log('Clearing old data...');
    await connection.query('DELETE FROM pincodes');
    await connection.query('DELETE FROM cities');
    await connection.query('DELETE FROM districts');
    await connection.query('DELETE FROM states');
    await connection.query('TRUNCATE TABLE geo_location');

    console.log('Inserting test data into geo_location...');
    const testData = [
      ['Tamil Nadu', 'Chennai', 'Guindy', '600032'],
      ['Tamil Nadu', 'Chennai', 'Adyar', '600020'],
      ['Karnataka', 'Bangalore', 'Indiranagar', '560038']
    ];

    for (const [s, d, c, p] of testData) {
      await connection.query(
        'INSERT INTO geo_location (state_name, district_name, city_name, pincode) VALUES (?, ?, ?, ?)',
        [s, d, c, p]
      );
    }

    console.log('Running normalization queries...');
    
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
    console.log('Normalization successful!');

    const [states] = await pool.query('SELECT * FROM states');
    console.log('\nStates:', states);
    
    const [pincodes] = await pool.query('SELECT p.*, c.name as city_name FROM pincodes p JOIN cities c ON p.city_id = c.id');
    console.log('\nPincodes with Cities:', pincodes);

  } catch (error) {
    await connection.rollback();
    console.error('Normalization failed:', error);
  } finally {
    connection.release();
    process.exit();
  }
}

testNormalization();
