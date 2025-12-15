// src/services/reservationService.js
import reservationRepo from "../repositories/reservationRepository.js";

export default {
    // Create reservation for a customer
    createReservation: async (userId, date, time, size) => {
        // Check if user already has a reservation at this date and time
        const existingReservation = await reservationRepo.findByUserDateAndTime(userId, date, time);
        
        if (existingReservation) {
            throw new Error('You already have a reservation at this date and time');
        }
        
        // Create the reservation
        return reservationRepo.create({ userId, date, time, partySize: size });
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
