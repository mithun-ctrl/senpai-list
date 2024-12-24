import mongoose from "mongoose";
import { config } from '../config.js'

const URL = config.MONGODB_URI;

const connectDatabase = async (req, res) => {
    try {
        await mongoose.connect(URL);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.log("Connection Failed");
        process.exit(0);
    }
};

export default connectDatabase;
