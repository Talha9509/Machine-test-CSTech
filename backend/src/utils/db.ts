import mongoose from 'mongoose'

export const connectDB = async () => {
  const mongoDB = process.env.MONGODB_URL
  try {
    await mongoose.connect(mongoDB!)
    console.log("mongoDB connected")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

