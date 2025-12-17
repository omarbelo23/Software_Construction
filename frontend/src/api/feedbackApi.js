import axios from "axios";

const API = "http://localhost:4000/api/feedback";

export const submitFeedback = (token, data) =>
    axios.post(API, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const listFeedback = (token) =>
    axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
    });
