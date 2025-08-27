import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { URI, port } from './config.mjs';
import router from './src/routes/route.mjs';

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow Netlify domains
    if (origin.includes('netlify.app') || origin.includes('netlify.com')) {
      return callback(null, true);
    }
    
    // Allow your specific Netlify domain (replace with your actual domain)
    if (origin.includes('your-app-name.netlify.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(URI).then(() => console.log("database connected successfully")).catch((err) => console.log(err));

app.use('/', router);

app.listen(port || 8080, () => {
  console.log(`Server started on port ${port}`);
})
