import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/userManagement-react');
        console.log("mongoDB connected");
    }
    catch (error) {
        console.log('mongoDB error', error.message);
        process.exit(1);
    }
};
export default connect;
