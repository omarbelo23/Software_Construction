import ReservationFoodOrder from "../models/ReservationFoodOrder.js";

export default {
    addFoodToReservation: (reservationId, menuItemId, quantity) =>
        ReservationFoodOrder.create({ reservationId, menuItemId, quantity }),

    getFoodByReservation: (reservationId) =>
        ReservationFoodOrder.find({ reservationId }).populate("menuItemId")
};
