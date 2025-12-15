// src/controllers/menuController.js
import menuService from "../services/menuService.js";

export default {
    list: async (req, res) => {
        try {
            const menu = await menuService.listMenu();
            res.json(menu);
        } catch (err) {
            res.status(500).json({ error: "Failed to load menu" });
        }
    },

    create: async (req, res) => {
        try {
            const { name, description, price, category, isAvailable } = req.body;

            const item = await menuService.createMenuItem(
                name,
                description,
                price,
                category,
                isAvailable
            );

            res.status(201).json(item);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};
