import { useEffect, useState } from "react";
import { getMenu } from "../api/menuApi.js";

export default function AdminMenu() {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        getMenu()
            .then(res => setMenu(res.data))
            .catch(err => console.error("Error loading menu:", err));
    }, []);

    return (
        <div>
            <h2>Menu Items</h2>

            {menu.length === 0 ? (
                <p>No menu items found</p>
            ) : (
                <ul>
                    {menu.map(item => (
                        <li key={item._id} style={{ marginBottom: "10px" }}>
                            <strong>{item.name}</strong> — ${item.price}
                            <br />
                            Category: {item.category}
                            <br />
                            Available: {item.isAvailable ? "Yes" : "No"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
