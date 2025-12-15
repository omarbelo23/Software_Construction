// Quick script to add partySize to existing reservations that don't have it
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const updateReservations = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");

        // Update all reservations that don't have partySize
        const result = await mongoose.connection.db.collection('reservations').updateMany(
            { partySize: { $exists: false } },
            { $set: { partySize: 2 } }
        );

        console.log(`Updated ${result.modifiedCount} reservations with default partySize of 2`);
        
        // Show all reservations
        const reservations = await mongoose.connection.db.collection('reservations').find().toArray();
        console.log("\nAll reservations:");
        reservations.forEach(r => {
            console.log(`- Date: ${r.date}, Time: ${r.time}, Party Size: ${r.partySize}`);
        });

        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

updateReservations();
