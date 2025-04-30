import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try {
        const connectionString = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${connectionString.connection.host}`);
        
    } catch (error) {
        console.log("Error in connecting Mongodb",error);
        process.exit(1) //1 means error
        
    }
}