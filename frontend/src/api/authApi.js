import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const signup = (data) => axios.post(`${API}/signup`, data);
export const login = (data) => axios.post(`${API}/login`, data);
