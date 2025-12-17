import ReservationFoodOrder from "../models/ReservationFoodOrder.js";

export default {
    addFoodToReservation: (reservationId, menuItemId, quantity) =>
        ReservationFoodOrder.findOneAndUpdate(
            { reservationId, menuItemId },
            { $inc: { quantity: quantity } },
            { new: true, upsert: true }
        ),

    getFoodByReservation: (reservationId) =>
        ReservationFoodOrder.find({ reservationId }).populate("menuItemId")
};
