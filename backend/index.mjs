import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { URI, port } from './config.mjs';
import router from './src/routes/route.mjs';
const app= express();
app.use(cors());
app.use(express.json());
mongoose.connect(URI).then(()=>console.log("database connected successfully")).catch((err)=>console.log(err));
app.use('/', router);
app.listen(port||8080, ()=>{
    console.log(`Server started on port ${port}`);
})
