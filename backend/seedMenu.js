import mongoose from "mongoose";
import MenuItem from "./src/models/MenuItem.js";

const MONGO_URI = "mongodb://localhost:27017/restaurant-system";

const menuItems = [
    {
        name: "Classic Burger",
        price: 120,
        category: "Main",
        description: "Beef patty, cheese, lettuce, tomato, special sauce.",
        isAvailable: true,
    },
    {
        name: "Grilled Chicken",
        price: 140,
        category: "Main",
        description: "Seasoned grilled chicken breast with herbs.",
        isAvailable: true,
    },
    {
        name: "Caesar Salad",
        price: 90,
        category: "Starter",
        description: "Romaine lettuce, parmesan, croutons, Caesar dressing.",
        isAvailable: true,
    },
    {
        name: "French Fries",
        price: 45,
        category: "Side",
        description: "Crispy golden fries with salt and pepper.",
        isAvailable: true,
    },
    {
        name: "Chocolate Cake",
        price: 60,
        category: "Dessert",
        description: "Rich moist chocolate cake slice.",
        isAvailable: true,
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        await MenuItem.deleteMany({});
        console.log("Menu cleared");

        await MenuItem.insertMany(menuItems);
        console.log("Menu inserted");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
