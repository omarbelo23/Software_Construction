import Reservation from "../models/Reservation.js";
import ReservationFoodOrder from "../models/ReservationFoodOrder.js";
import User from "../models/User.js";

export default {
    create: (data) => Reservation.create(data),

    // Count reservations for a specific date and time slot
    countByDateAndTime: (date, time) => Reservation.countDocuments({ date, time }),

    // Get all reservations for a specific date (to check which slots are full)
    findByDate: async (date) => {
        return Reservation.find({ date }).lean();
    },

    findById: (id) => Reservation.findById(id),

    findByUserDateAndTime: (userId, date, time) => {
        return Reservation.findOne({ userId, date, time });
    },

    deleteById: (id) => Reservation.findByIdAndDelete(id),

    findByUser: async (userId) => {
        const reservations = await Reservation.find({ userId }).lean();

        // Populate food orders for each reservation
        for (let reservation of reservations) {
            const foodOrders = await ReservationFoodOrder.find({
                reservationId: reservation._id
            }).populate('menuItemId');
            reservation.foodOrders = foodOrders;
        }

        return reservations;
    },

    listAll: async () => {
        const reservations = await Reservation.find().lean();

        // Populate user and food orders for each reservation
        for (let reservation of reservations) {
            // Get user information
            const user = await User.findById(reservation.userId).select('name email').lean();
            reservation.user = user;

            // Get food orders
            const foodOrders = await ReservationFoodOrder.find({
                reservationId: reservation._id
            }).populate('menuItemId');
            reservation.foodOrders = foodOrders;
        }

        return reservations || [];
    }
};
