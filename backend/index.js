import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import connectDatabase from './utils/connectDB.js'
import animeRoutes from './routes/animeRoutes.js'
import path from "path";


const app = express();

const corsOption = {
  origin:"https://quindecim.up.railway.app",
  credentials:true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(morgan('dev')); 

const _dirname = path.resolve();

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/anim', animeRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('*', (req, res) =>{
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})


connectDatabase().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });
})
