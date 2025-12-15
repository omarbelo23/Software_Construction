import axios from "axios";

export const getMenu = () =>
    axios.get("http://localhost:4001/api/menu");
