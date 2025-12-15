import axios from "axios";

const API = "http://localhost:4001/api/reservation-food-orders";

export const createFoodOrder = (token, reservationId, data) =>
    axios.post(`${API}/${reservationId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const getFoodOrdersByReservation = (token, reservationId) =>
    axios.get(`${API}/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
