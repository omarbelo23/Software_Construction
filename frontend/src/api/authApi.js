import axios from "axios";

const API = "http://localhost:4000/api/auth";

export const signup = (data) => axios.post(`${API}/signup`, data);
export const login = (data) => axios.post(`${API}/login`, data);
export const getAllUsers = (token) => 
    axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteUser = (token, userId) =>
    axios.delete(`${API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
