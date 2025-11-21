import Reservation from "../models/Reservation.js";

export default {
    create: (data) => Reservation.create(data),
    findByUser: (userId) => Reservation.find({ userId }),
    listAll: () => Reservation.find()
};
