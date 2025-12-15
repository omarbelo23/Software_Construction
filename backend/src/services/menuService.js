// src/services/menuService.js
import menuRepo from "../repositories/menuRepository.js";

export default {
    // Public: list all available menu items
    listMenu: () => menuRepo.listAll(),

    // Admin: create a new menu item
    createMenuItem: async (name, description, price, category, isAvailable = true) => {
        if (!name || price == null) {
            throw new Error("name and price are required");
        }

        return menuRepo.create({
            name,
            description,
            price,
            category,
            isAvailable,
        });
    },
};
