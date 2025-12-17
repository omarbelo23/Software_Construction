import Feedback from "../models/Feedback.js";
import ReservationFoodOrder from "../models/ReservationFoodOrder.js";

export default {
    create: (data) => Feedback.create(data),
    findAll: async () => {
        const feedbacks = await Feedback.find()
            .populate("userId", "name email")
            .populate("reservationId")
            .lean();

        const safeFeedbacks = feedbacks || [];

        for (let feedback of safeFeedbacks) {
            if (feedback.reservationId) {
                const foodOrders = await ReservationFoodOrder.find({
                    reservationId: feedback.reservationId._id
                }).populate("menuItemId");
                feedback.reservationId.foodOrders = foodOrders;
            }
        }
        return safeFeedbacks;
    }
};
