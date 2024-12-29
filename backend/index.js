import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import connectDatabase from './utils/connectDB.js'
import animeRoutes from './routes/animeRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 


app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api', adminRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


connectDatabase().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})
