// src/services/reservationService.js
import reservationRepo from "../repositories/reservationRepository.js";

const MAX_RESERVATIONS_PER_SLOT = 5;

export default {
    // Create reservation for a customer
    createReservation: async (userId, date, time, size) => {
        // Check if user already has a reservation at this date and time
        const existingReservation = await reservationRepo.findByUserDateAndTime(userId, date, time);

        if (existingReservation) {
            throw new Error('You already have a reservation at this date and time');
        }

        // Check if this time slot is already full (max 5 reservations)
        const currentCount = await reservationRepo.countByDateAndTime(date, time);
        if (currentCount >= MAX_RESERVATIONS_PER_SLOT) {
            throw new Error('This time slot is fully booked. Please choose another time.');
        }

        // Create the reservation
        return reservationRepo.create({ userId, date, time, partySize: size });
    },

    // Get unavailable time slots for a specific date
    getUnavailableSlots: async (date) => {
        const reservations = await reservationRepo.findByDate(date);

        // Count reservations per time slot
        const slotCounts = {};
        reservations.forEach(reservation => {
            slotCounts[reservation.time] = (slotCounts[reservation.time] || 0) + 1;
        });

        // Return time slots that have 5 or more reservations
        const unavailableSlots = Object.entries(slotCounts)
            .filter(([time, count]) => count >= MAX_RESERVATIONS_PER_SLOT)
            .map(([time]) => time);

        return unavailableSlots;
    },

    // Get all reservations for one user
    getUserReservations: (userId) => reservationRepo.findByUser(userId),

    // Admin: get all reservations
    getAllReservations: () => reservationRepo.listAll(),

    // Delete a reservation (only if it belongs to the user OR user is admin)
    deleteReservation: async (reservationId, userId, userRole) => {
        const reservation = await reservationRepo.findById(reservationId);

        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // Check if the reservation belongs to the user OR if user is admin
        if (reservation.userId.toString() !== userId && userRole !== 'admin') {
            throw new Error('You can only delete your own reservations');
        }

        return reservationRepo.deleteById(reservationId);
    }
};
