import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    reservationId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String
});

export default mongoose.model("Feedback", feedbackSchema);
