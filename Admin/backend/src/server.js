import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import mailRoutes from './routes/mailRoutes.js';
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/mail', mailRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('LaDivyn Admin API is running...');
});

// Setup Port
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Admin Server running on port ${PORT}`);
});
