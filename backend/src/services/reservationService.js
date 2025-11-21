import reservationRepo from "../repositories/reservationRepository.js";

export default {
    createReservation: async (userId, date, time, size) => {
        return reservationRepo.create({ userId, date, time, partySize: size });
    },

    getUserReservations: (userId) => reservationRepo.findByUser(userId),

    getAllReservations: () => reservationRepo.listAll()
};
