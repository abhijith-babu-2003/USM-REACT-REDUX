import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connect =async():Promise<void>=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string || 'mongodb://localhost:27017/userManagement-react')
        console.log("mongoDB connected")
    } catch (error:any) {
        console.log('mongoDB error',error.message);
        process.exit(1)    
    }
}
export default connect