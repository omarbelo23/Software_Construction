import axios from "axios";

const API = "http://localhost:4001/api/reservations";

export const createReservation = (token, data) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const listUserReservations = (token) =>
    axios.get(`${API}/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const listAllReservations = (token) =>
    axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteReservation = (token, reservationId) =>
    axios.delete(`${API}/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
