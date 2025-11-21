import reservationService from "../services/reservationService.js";

export default {
    create: async (req, res) => {
        try {
            const reservation = await reservationService.createReservation(
                req.user.id,
                req.body.date,
                req.body.time,
                req.body.partySize
            );
            res.json(reservation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    listUser: async (req, res) => {
        const list = await reservationService.getUserReservations(req.user.id);
        res.json(list);
    },

    listAll: async (req, res) => {
        const list = await reservationService.getAllReservations();
        res.json(list);
    }
};
