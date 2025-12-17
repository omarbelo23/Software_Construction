import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    rating: Number,
    comment: String
});

export default mongoose.model("Feedback", feedbackSchema);
