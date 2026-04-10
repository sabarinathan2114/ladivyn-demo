import axios from 'axios';

async function test() {
  try {
    const products = await axios.get('http://localhost:5001/api/products');
    console.log('--- PRODUCTS API ---');
    console.log('Status:', products.status);
    console.log('IsArray:', Array.isArray(products.data));
    console.log('Length:', products.data.length);

    const districts = await axios.get('http://localhost:5001/api/locations/districts');
    console.log('--- DISTRICTS API ---');
    console.log('Status:', districts.status);
    console.log('IsArray:', Array.isArray(districts.data));
    console.log('Length:', districts.data.length);

    process.exit(0);
  } catch (err) {
    console.error('Test Error:', err.message);
    process.exit(1);
  }
}

test();
