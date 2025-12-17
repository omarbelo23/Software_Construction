import feedbackService from "../services/feedbackService.js";

export default {
    submit: async (req, res) => {
        try {
            const feedback = await feedbackService.submitFeedback(
                req.user.id,
                req.body.reservationId,
                req.body.rating,
                req.body.comment
            );
            res.json(feedback);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    list: async (req, res) => {
        try {
            const all = await feedbackService.getAllFeedback();
            res.json(all);
        } catch (err) {
            console.error("List feedback error:", err);
            res.status(400).json({ error: err.message });
        }
    }
};
