import reservationFoodOrderService from "../services/reservationFoodOrderService.js";

export default {
    orderFoodForReservation: async (req, res) => {
        try {
            const reservationId = req.params.reservationId;
            const items = req.body.items; // [{ menuItemId, quantity }, ...]

            const orderedItems = await reservationFoodOrderService.orderFood(reservationId, items);
            res.status(201).json({ message: "Food ordered successfully", orderedItems });
        } catch (err) {
            console.error("Order food error:", err);
            res.status(400).json({ error: err.message });
        }
    },

    getOrderForReservation: async (req, res) => {
        try {
            const reservationId = req.params.reservationId;
            const order = await reservationFoodOrderService.getOrderForReservation(reservationId);
            res.json(order);
        } catch (err) {
            console.error("Get order error:", err);
            res.status(400).json({ error: err.message });
        }
    }
};
