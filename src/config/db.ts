import mongoose from "mongoose";
import { config } from "./config";

const connectDb = async () => {
    try {
        mongoose
        .connect(config.mongoUri as string)
        .then(() => {
            console.log(`${new Date()}: Successfully connected to the database`);
        })
        .catch(err => console.log(err));
    } catch (error) {
        console.log(`There was an error connecting to the database ${error}`);
        process.exit(1);
    }
}

export default connectDb;