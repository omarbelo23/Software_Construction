// src/services/reservationService.js
import reservationRepo from "../repositories/reservationRepository.js";
import OnlineReservationStrategy from "../strategies/OnlineReservationStrategy.js";

const MAX_RESERVATIONS_PER_SLOT = 5;

// Strategy Registry
const strategies = {
    'online': new OnlineReservationStrategy()
};

export default {
    // Create reservation for a customer
    // DESIGN PATTERN: Strategy (Context)
    // - The Context maintains a reference to a Strategy object.
    // - It delegates the work (validation) to the Strategy object instead of implementing it directly.
    createReservation: async (userId, date, time, size, type = 'online') => {
        // Select strategy dynamically based on the type
        const strategy = strategies[type] || strategies['online'];

        // Delegate validation to the selected strategy
        await strategy.validate({
            userId,
            date,
            time,
            repository: reservationRepo,
            MAX_RESERVATIONS_PER_SLOT
        });

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
