// src/controllers/reservationController.js
import reservationService from "../services/reservationService.js";

export default {
    // Customer creates reservation
    create: async (req, res) => {
        try {
            const reservation = await reservationService.createReservation(
                req.user.id,
                req.body.date,
                req.body.time,
                // Accept both "size" and "partySize"
                req.body.partySize || req.body.size
            );
            res.json(reservation);
        } catch (err) {
            console.error("Create reservation error:", err);
            res.status(400).json({ message: err.message });
        }
    },

    // Get unavailable time slots for a specific date
    getUnavailableSlots: async (req, res) => {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ message: "Date is required" });
            }
            const unavailableSlots = await reservationService.getUnavailableSlots(date);
            res.json({ unavailableSlots });
        } catch (err) {
            console.error("Get unavailable slots error:", err);
            res.status(400).json({ message: err.message });
        }
    },

    // Customer: view own reservations
    listUser: async (req, res) => {
        try {
            const list = await reservationService.getUserReservations(req.user.id);
            res.json(list);
        } catch (err) {
            console.error("List user reservations error:", err);
            res.status(400).json({ error: err.message });
        }
    },

    // Admin: view all reservations
    listAll: async (req, res) => {
        try {
            const list = await reservationService.getAllReservations();
            res.json(list);
        } catch (err) {
            console.error("List all reservations error:", err);
            res.status(400).json({ error: err.message });
        }
    },

    // Delete a reservation
    delete: async (req, res) => {
        try {
            await reservationService.deleteReservation(req.params.id, req.user.id, req.user.role);
            res.json({ message: "Reservation deleted successfully" });
        } catch (err) {
            console.error("Delete reservation error:", err);
            res.status(400).json({ message: err.message });
        }
    }
};
