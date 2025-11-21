import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    date: String,
    time: String,
    partySize: Number
});

export default mongoose.model("Reservation", reservationSchema);
