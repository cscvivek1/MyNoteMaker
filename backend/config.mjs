import dotenv from 'dotenv'
dotenv.config();
let URI=process.env.mongodb;
let port= process.env.port;
let secretToken = process.env.secretToken;
export {URI, port, secretToken};