import axios from "axios";

const API = "http://localhost:4001/api/reservations";

// Get unavailable time slots for a specific date (no auth required)
export const getUnavailableSlots = (date) =>
    axios.get(`${API}/unavailable?date=${date}`);

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
