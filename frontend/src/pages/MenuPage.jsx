import React, { useEffect, useState } from "react";
import { getMenu } from "../api/menuApi";
import { Button } from "@/components/ui/button";
import { useTheme } from "../context/ThemeContext";
import { cn } from "@/lib/utils";

export default function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === "dark";

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

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-24">Our Menu</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24">
                    {menu.map((item) => (
                        <div
                            key={item._id}
                            className={cn(
                                "relative rounded-[2rem] p-6 pt-28 text-center shadow-sm hover:shadow-md transition-all duration-300 group",
                                isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                            )}
                        >
                            {/* Floating Image */}
                            <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                                <div className={cn(
                                    "relative w-48 h-48 rounded-full shadow-xl overflow-hidden border-[6px] transition-transform duration-300 group-hover:scale-105",
                                    isDark ? "border-gray-800" : "border-white"
                                )}>
                                    <img
                                        src={item.image || "https://placehold.co/200x200?text=No+Image"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Price Badge */}
                                <div className={cn(
                                    "absolute top-4 right-2 bg-black text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm border-2 shadow-lg z-10",
                                    isDark ? "border-gray-800" : "border-white"
                                )}>
                                    ${item.price}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className={cn("text-xl font-bold mb-3 mt-2", isDark ? "text-white" : "text-gray-900")}>
                                {item.name}
                            </h3>
                            <p className={cn("text-sm mb-6 line-clamp-3 leading-relaxed px-2", isDark ? "text-gray-300" : "text-muted-foreground")}>
                                {item.description || "No description available."}
                            </p>

                            <div className="text-sm font-medium text-primary uppercase tracking-wider">
                                {item.category}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
