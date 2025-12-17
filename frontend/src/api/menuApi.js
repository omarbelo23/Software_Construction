import axios from "axios";

export const getMenu = () =>
    axios.get("http://localhost:4001/api/menu");

export const createMenuItem = (token, data) =>
    axios.post("http://localhost:4001/api/menu", data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const updateMenuItem = (token, id, data) =>
    axios.put(`http://localhost:4001/api/menu/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const deleteMenuItem = (token, id) =>
    axios.delete(`http://localhost:4001/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
