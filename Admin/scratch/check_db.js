import pool from '../backend/src/config/db.js';

async function checkSchema() {
  try {
    const [products] = await pool.query('DESCRIBE products');
    console.log('--- PRODUCTS TABLE ---');
    products.forEach(c => console.log(`${c.Field} (${c.Type})`));

    const [orders] = await pool.query('DESCRIBE orders');
    console.log('\n--- ORDERS TABLE ---');
    orders.forEach(c => console.log(`${c.Field} (${c.Type})`));

    const [tables] = await pool.query('SHOW TABLES');
    console.log('\n--- TABLES ---');
    tables.forEach(t => console.log(Object.values(t)[0]));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
