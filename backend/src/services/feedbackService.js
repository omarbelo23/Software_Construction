// src/services/feedbackService.js
import feedbackRepo from "../repositories/feedbackRepository.js";

export default {
    submitFeedback: async (userId, reservationId, rating, comment) => {
        return feedbackRepo.create({ userId, reservationId, rating, comment });
    },

    getAllFeedback: () => feedbackRepo.findAll(),
};
