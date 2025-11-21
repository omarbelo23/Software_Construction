import menuService from "../services/menuService.js";

export default {
    list: async (req, res) => {
        const menu = await menuService.listMenu();
        res.json(menu);
    }
};
