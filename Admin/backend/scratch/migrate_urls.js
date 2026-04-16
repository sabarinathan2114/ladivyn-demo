import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ladivyn'
};

async function migrate() {
  const connection = await mysql.createConnection(config);
  console.log('Connecting to database...');

  try {
    // 1. Update product_images table
    console.log('Updating product_images...');
    const [res1] = await connection.query(
      "UPDATE product_images SET image_url = REPLACE(image_url, 'localhost:5001', 'localhost:5000') WHERE image_url LIKE '%localhost:5001%'"
    );
    console.log(`Updated ${res1.affectedRows} product images.`);

    // 2. Update blogs table
    console.log('Updating blogs...');
    const [res2] = await connection.query(
      "UPDATE blogs SET image_url = REPLACE(image_url, 'localhost:5001', 'localhost:5000') WHERE image_url LIKE '%localhost:5001%'"
    );
    console.log(`Updated ${res2.affectedRows} blog images.`);

    // 3. Optional: Fix relative paths that might be missing the domain completely
    // (If primary_image in any table just says "/uploads/...", it will still fail if accessed from frontend)
    // Actually, it's better to keep them relative and fix the frontend, 
    // but the user wants them to show up, and if they were hardcoded before, this fix covers it.

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await connection.end();
  }
}

migrate();
