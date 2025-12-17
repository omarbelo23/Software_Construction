import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu } from "../api/menuApi.js";
import { createFoodOrder, getFoodOrdersByReservation } from "../api/reservationFoodOrderApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "../context/ThemeContext";
import { cn } from "@/lib/utils";

export default function OrderFoodPage() {
    const { reservationId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, ordersRes] = await Promise.all([
                    getMenu(),
                    getFoodOrdersByReservation(token, reservationId)
                ]);
                setMenuItems(menuRes.data);
                setOrders(ordersRes.data);
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reservationId, token]);

    const handleQuantityChange = (itemId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: Math.max(0, parseInt(quantity) || 0)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemsToOrder = Object.entries(selectedItems)
            .filter(([_, quantity]) => quantity > 0)
            .map(([menuItemId, quantity]) => ({ menuItemId, quantity }));

        if (itemsToOrder.length === 0) {
            alert("Please select at least one item to order");
            return;
        }

        try {
            await createFoodOrder(token, reservationId, { items: itemsToOrder });
            alert("Food order placed successfully!");
            navigate("/");
        } catch (error) {
            alert("Failed to place order: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Order Food</h1>
                    <p className="text-muted-foreground mb-6">
                        Select items from the menu and specify quantities for your reservation.
                    </p>

                    {orders.length > 0 && (
                        <Alert className="mb-6 text-left">
                            <AlertDescription>
                                <strong>Previous Orders:</strong> You have already placed {orders.length} order(s) for this reservation.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24 mb-24">
                        {menuItems.map((item) => (
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
                                <p className={cn("text-sm mb-4 line-clamp-2 leading-relaxed px-2", isDark ? "text-gray-300" : "text-muted-foreground")}>
                                    {item.description || "No description available."}
                                </p>

                                <div className="text-sm font-medium text-primary uppercase tracking-wider mb-6">
                                    {item.category}
                                </div>

                                {/* Quantity Input */}
                                <div className="flex items-center justify-center gap-2">
                                    <label htmlFor={`quantity-${item._id}`} className="text-sm font-medium">
                                        Qty:
                                    </label>
                                    <Input
                                        id={`quantity-${item._id}`}
                                        type="number"
                                        min="0"
                                        className="w-20 text-center"
                                        value={selectedItems[item._id] || 0}
                                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sticky Bottom Bar or Fixed Button */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 flex justify-center shadow-lg">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full max-w-md text-lg font-bold shadow-xl"
                            disabled={!Object.values(selectedItems).some(q => q > 0)}
                        >
                            Place Order ({Object.values(selectedItems).reduce((a, b) => a + b, 0)} items)
                        </Button>
                    </div>
                    {/* Spacer for fixed bottom bar */}
                    <div className="h-20"></div>
                </form>
            </div>
        </div>
    );
}
