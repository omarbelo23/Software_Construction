import React, { useEffect, useState } from "react";
import { getMenu } from "../api/menuApi";

export default function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMenu()
            .then((res) => {
                setMenu(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading menu:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <h1 className="text-3xl font-bold mb-4">Menu</h1>
                <p>Loading menu...</p>
            </div>
        );
    }

    if (menu.length === 0) {
        return (
            <div className="min-h-screen p-6">
                <h1 className="text-3xl font-bold mb-4">Menu</h1>
                <p>No menu items available.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map((item) => (
                    <div
                        key={item._id}
                        className="border rounded-lg p-4 shadow bg-white"
                    >
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-500">{item.category}</p>

                        {item.description && (
                            <p className="mt-2 text-gray-700">{item.description}</p>
                        )}

                        <p className="mt-3 font-bold">{item.price} EGP</p>

                        <p
                            className={`mt-2 font-medium ${
                                item.isAvailable ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {item.isAvailable ? "Available" : "Not Available"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
