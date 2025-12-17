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
            const { name, description, price, category, image, isAvailable } = req.body;

            const item = await menuService.createMenuItem(
                name,
                description,
                price,
                category,
                image,
                isAvailable
            );

            res.status(201).json(item);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedItem = await menuService.updateMenuItem(id, req.body);
            res.json(updatedItem);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await menuService.deleteMenuItem(id);
            res.json({ message: "Menu item deleted" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};
