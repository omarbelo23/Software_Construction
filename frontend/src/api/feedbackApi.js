import axios from "axios";

const API = "http://localhost:5000/api/feedback";

export const submitFeedback = (token, data) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const listFeedback = (token) =>
    axios.get(`${API}/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
