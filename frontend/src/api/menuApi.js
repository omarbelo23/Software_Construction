import axios from "axios";

export const getMenu = () =>
    axios.get("http://localhost:5000/api/menu");
