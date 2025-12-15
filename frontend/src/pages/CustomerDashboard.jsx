import { useEffect, useState } from "react";
import { listUserReservations, deleteReservation } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

export default function CustomerDashboard() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = () => {
        listUserReservations(token)
            .then((res) => setReservations(res.data))
            .catch((err) => console.error("Error loading reservations:", err));
    };

    const handleDelete = async (reservationId) => {
        if (!confirm("Are you sure you want to delete this reservation?")) {
            return;
        }

        try {
            await deleteReservation(token, reservationId);
            alert("Reservation deleted successfully!");
            loadReservations(); // Reload the list
        } catch (error) {
            alert("Failed to delete reservation: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Welcome, {user?.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Your Dashboard
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
                Your Reservations
            </Typography>

            {reservations.length === 0 ? (
                <Typography>You have no reservations yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {reservations.map((r) => (
                        <Grid item xs={12} key={r._id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="h6">
                                                {r.date} at {r.time}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Party Size: {r.partySize || r.size || 'Not specified'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    {r.foodOrders && r.foodOrders.length > 0 && (
                                        <Box mt={2}>
                                            <Typography variant="subtitle2" color="primary">
                                                Food Orders:
                                            </Typography>
                                            <List dense>
                                                {r.foodOrders.map((order, idx) => (
                                                    <ListItem key={idx} disablePadding>
                                                        <ListItemText 
                                                            primary={`${order.quantity}x ${order.menuItemId?.name || 'Item'}`}
                                                            secondary={order.menuItemId?.price && `$${(order.menuItemId.price * order.quantity).toFixed(2)}`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                Total: ${r.foodOrders.reduce((sum, order) => sum + (order.quantity * (order.menuItemId?.price || 0)), 0).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => navigate(`/order-food/${r._id}`)}
                                    >
                                        Order Food
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="error"
                                        onClick={() => handleDelete(r._id)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
                Quick Actions
            </Typography>
            <List>
                <ListItem component={Link} to="/reserve">
                    <ListItemText primary="Make a Reservation" />
                </ListItem>
                <ListItem component={Link} to="/menu">
                    <ListItemText primary="Browse Menu" />
                </ListItem>
                <ListItem component={Link} to="/feedback">
                    <ListItemText primary="Leave Feedback" />
                </ListItem>
            </List>
        </Container>
    );
}
