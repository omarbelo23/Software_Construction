import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/*
  Singleton Pattern Implementation for Database Connection
  
  DESIGN PATTERN: Singleton
  - Ensures only one instance of the Database class exists.
  - Provides a global point of access to that instance.
*/
class Database {
    constructor() {
        // SINGLETON: Check if an instance already exists
        if (Database.instance) {
            return Database.instance;
        }
        
        this.isConnected = false;
        // SINGLETON: Save the instance
        Database.instance = this;
    }

    async connect() {
        if (this.isConnected) {
            console.log("Using existing MongoDB connection");
            return;
        }

        try {
            await mongoose.connect(process.env.MONGODB_URI);
            this.isConnected = true;
            console.log("MongoDB connected (Singleton)");
        } catch (error) {
            console.error("Database connection error:", error);
            process.exit(1);
        }
    }
}

// SINGLETON: Export a single instance
const databaseInstance = new Database();
// Note: We do not freeze the instance because we need to update isConnected state.
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
