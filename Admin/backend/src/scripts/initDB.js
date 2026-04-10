import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const initDB = async () => {
  let connection;
  try {
    // First, connect without a specific database to ensure we can create it if it doesn't exist
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server. Checking Database...');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ladivyn'}\`;`);
    console.log(`Database '${process.env.DB_NAME || 'ladivyn'}' is ready.`);

    // Switch to the correct database
    await connection.query(`USE \`${process.env.DB_NAME || 'ladivyn'}\`;`);

    // Define table creation statements
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          mobile VARCHAR(15),
          password TEXT NOT NULL,
          role VARCHAR(20) DEFAULT 'customer',
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS subcategories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category_id INT,
          name VARCHAR(100) NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS states (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100)
      );`,
      `CREATE TABLE IF NOT EXISTS districts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          state_id INT,
          name VARCHAR(100),
          FOREIGN KEY (state_id) REFERENCES states(id)
      );`,
      `CREATE TABLE IF NOT EXISTS cities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          district_id INT,
          name VARCHAR(100),
          FOREIGN KEY (district_id) REFERENCES districts(id)
      );`,
      `CREATE TABLE IF NOT EXISTS pincodes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          city_id INT,
          pincode VARCHAR(10),
          FOREIGN KEY (city_id) REFERENCES cities(id)
      );`,
      `CREATE TABLE IF NOT EXISTS user_addresses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          address TEXT,
          state_id INT,
          district_id INT,
          city_id INT,
          pincode_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (state_id) REFERENCES states(id),
          FOREIGN KEY (district_id) REFERENCES districts(id),
          FOREIGN KEY (city_id) REFERENCES cities(id),
          FOREIGN KEY (pincode_id) REFERENCES pincodes(id)
      );`,
      `CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          category_id INT,
          subcategory_id INT,
          cost_price DECIMAL(10,2),
          display_price DECIMAL(10,2),
          has_discount BOOLEAN DEFAULT FALSE,
          discount_percent DECIMAL(5,2),
          discount_amount DECIMAL(10,2),
          short_description TEXT,
          description TEXT,
          quantity INT DEFAULT 0,
          is_out_of_stock BOOLEAN DEFAULT FALSE,
          barcode VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id),
          FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
      );`,
      `CREATE TABLE IF NOT EXISTS product_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT,
          image_url TEXT,
          is_primary BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS inventory_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT,
          change_qty INT,
          action VARCHAR(50),
          reference_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id)
      );`,
      `CREATE TABLE IF NOT EXISTS coupons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(50) UNIQUE,
          discount_percent DECIMAL(5,2),
          discount_amount DECIMAL(10,2),
          min_order_value DECIMAL(10,2),
          expiry_date DATE,
          is_active BOOLEAN DEFAULT TRUE
      );`,
      `CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_no VARCHAR(50) UNIQUE,
          user_id INT,
          total_amount DECIMAL(10,2),
          discount_amount DECIMAL(10,2),
          final_amount DECIMAL(10,2),
          status VARCHAR(50) DEFAULT 'pending',
          payment_status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
      );`,
      `CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          product_id INT,
          quantity INT,
          price DECIMAL(10,2),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id)
      );`,
      `CREATE TABLE IF NOT EXISTS order_addresses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          customer_name VARCHAR(100),
          address TEXT,
          mobile VARCHAR(15),
          email VARCHAR(150),
          state VARCHAR(100),
          district VARCHAR(100),
          city VARCHAR(100),
          pincode VARCHAR(10),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          payment_method VARCHAR(50),
          transaction_id VARCHAR(100),
          amount DECIMAL(10,2),
          status VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id)
      );`,
      `CREATE TABLE IF NOT EXISTS returns (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          reason TEXT,
          status VARCHAR(50) DEFAULT 'requested',
          refund_amount DECIMAL(10,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id)
      );`,
      `CREATE TABLE IF NOT EXISTS bulk_upload_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          file_name TEXT,
          total_records INT,
          success_count INT,
          failed_count INT,
          uploaded_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (uploaded_by) REFERENCES users(id)
      );`,
      `CREATE TABLE IF NOT EXISTS audit_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          action VARCHAR(100),
          table_name VARCHAR(100),
          record_id INT,
          old_data JSON,
          new_data JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
      );`
    ];

    // Execute all create table statements in sequence
    for (const sql of sqlStatements) {
      console.log('Executing table creation query...');
      await connection.query(sql);
    }
    
    // Create an index specifically (since CREATE INDEX IF NOT EXISTS syntax requires MariaDB or MySQL 8.0.14+)
    try {
        await connection.query('CREATE INDEX idx_products_barcode ON products(barcode);');
        console.log('Index idx_products_barcode created');
    } catch (indexError) {
        // It likely already exists (Error 1061: Duplicate key name)
        if (indexError.code === 'ER_DUP_KEYNAME') {
            console.log('Index idx_products_barcode already exists.');
        } else {
            console.error('Warning: Error creating index', indexError.message);
        }
    }

    console.log('Database Initialization Completed Successfully.');
  } catch (error) {
    console.error('Error Initializing Database:', error);
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
};

initDB();
