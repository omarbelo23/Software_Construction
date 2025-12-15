import mongoose from "mongoose";

const reservationFoodOrderSchema = new mongoose.Schema({
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    quantity: { type: Number, required: true, default: 1 },
});

export default mongoose.model("ReservationFoodOrder", reservationFoodOrderSchema);
