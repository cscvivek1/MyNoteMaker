import dotenv from 'dotenv'
dotenv.config()

export const URI = process.env.MONGODB
export const port = process.env.PORT || 5000
export const secretToken = process.env.SECRET_TOKEN || "mySecretKey123"
