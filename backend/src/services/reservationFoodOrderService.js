import reservationFoodOrderRepo from "../repositories/reservationFoodOrderRepository.js";

export default {
    orderFood: async (reservationId, items) => {
        // items = [{ menuItemId, quantity }, ...]
        const results = [];
        for (const item of items) {
            const ordered = await reservationFoodOrderRepo.addFoodToReservation(
                reservationId,
                item.menuItemId,
                item.quantity
            );
            results.push(ordered);
        }
        return results;
    },

    getOrderForReservation: (reservationId) =>
        reservationFoodOrderRepo.getFoodByReservation(reservationId)
};
