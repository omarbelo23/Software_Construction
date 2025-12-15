import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu } from "../api/menuApi.js";
import { createFoodOrder, getFoodOrdersByReservation } from "../api/reservationFoodOrderApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    Divider
} from "@mui/material";

export default function OrderFoodPage() {
    const { reservationId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});

    useEffect(() => {
        // Load menu items
        getMenu()
            .then((res) => setMenuItems(res.data))
            .catch((err) => console.error("Error loading menu:", err));

        // Load existing orders for this reservation
        getFoodOrdersByReservation(token, reservationId)
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Error loading orders:", err));
    }, [reservationId, token]);

    const handleQuantityChange = (itemId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: Math.max(0, parseInt(quantity) || 0)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filter items with quantity > 0
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

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Order Food for Your Reservation
            </Typography>
            <Typography color="text.secondary" paragraph>
                Select items from the menu and specify quantities
            </Typography>

            {orders.length > 0 && (
                <Paper sx={{ p: 2, mb: 4, bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="h6" gutterBottom>Previous Orders</Typography>
                    <Typography>
                        You have already placed {orders.length} order(s) for this reservation.
                    </Typography>
                </Paper>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {menuItems.map((item) => (
                        <Grid item xs={12} key={item._id}>
                            <Card variant="outlined">
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                        <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                                            ${item.price.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ minWidth: 100 }}>
                                        <TextField
                                            label="Quantity"
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            value={selectedItems[item._id] || 0}
                                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                        disabled={!Object.values(selectedItems).some(q => q > 0)}
                    >
                        Place Order
                    </Button>
                </Box>
            </form>
        </Container>
    );
}
