import { useEffect, useState } from "react";
import { listAllReservations, deleteReservation } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function AdminReservations() {
    const { token } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [filters, setFilters] = useState({
        date: "",
        time: "",
        userName: ""
    });

    // Generate time slots from 10:00 AM to 10:00 PM in 30-minute intervals
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 22; hour++) {
            for (let minute of [0, 30]) {
                if (hour === 22 && minute === 30) break; // Stop at 10:00 PM
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const isPM = hour >= 12;
                const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                const timeLabel = `${hour12}:${minute.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
                slots.push({ value: time24, label: timeLabel });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = () => {
        setLoading(true);
        listAllReservations(token)
            .then(res => {
                setReservations(res.data);
                setFilteredReservations(res.data); // Show all by default
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading reservations:", err);
                setLoading(false);
            });
    };

    const applyFilters = () => {
        let filtered = [...reservations];

        // Filter by date (only if filter is set)
        if (filters.date) {
            filtered = filtered.filter(r => r.date === filters.date);
        }

        // Filter by time (only if filter is set)
        if (filters.time) {
            filtered = filtered.filter(r => r.time === filters.time);
        }

        // Filter by user name (only if filter is set, case insensitive, partial match)
        if (filters.userName) {
            filtered = filtered.filter(r => 
                (r.user?.name || "").toLowerCase().includes(filters.userName.toLowerCase())
            );
        }

        setFilteredReservations(filtered);
    };

    const clearFilters = () => {
        setFilters({
            date: "",
            time: "",
            userName: ""
        });
        setFilteredReservations(reservations); // Reset to show all
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reservation?")) return;
        try {
            await deleteReservation(token, id);
            // Refresh list
            loadReservations();
        } catch (err) {
            alert("Failed to delete reservation: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return <Container sx={{ p: 4 }}><Typography>Loading reservations...</Typography></Container>;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>All Reservations</Typography>
            <Typography color="textSecondary" gutterBottom>
                Total: {reservations.length} | Showing: {filteredReservations.length}
            </Typography>

            {/* Filters Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Filters</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.date}
                            onChange={(e) => setFilters({...filters, date: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Time</InputLabel>
                            <Select
                                value={filters.time}
                                label="Time"
                                onChange={(e) => setFilters({...filters, time: e.target.value})}
                            >
                                <MenuItem value=""><em>All Times</em></MenuItem>
                                {timeSlots.map((slot) => (
                                    <MenuItem key={slot.value} value={slot.value}>
                                        {slot.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="User Name"
                            placeholder="Search by name..."
                            value={filters.userName}
                            onChange={(e) => setFilters({...filters, userName: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="contained" onClick={applyFilters}>
                                Apply Filters
                            </Button>
                            <Button variant="outlined" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Reservations Table */}
            {filteredReservations.length === 0 ? (
                <Typography>No reservations found with the current filters.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Party Size</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Customer Email</TableCell>
                                <TableCell>Food Orders</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredReservations.map(r => (
                                <TableRow key={r._id}>
                                    <TableCell>{r.date}</TableCell>
                                    <TableCell>{r.time}</TableCell>
                                    <TableCell>{r.partySize}</TableCell>
                                    <TableCell>{r.user?.name || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{r.user?.email || 'N/A'}</TableCell>
                                    <TableCell>
                                        {r.foodOrders && r.foodOrders.length > 0 ? (
                                            <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    sx={{ p: 0, minHeight: 'auto', '& .MuiAccordionSummary-content': { m: 0 } }}
                                                >
                                                    <Typography color="primary" variant="body2">
                                                        {r.foodOrders.length} item(s) - Total: ${r.foodOrders.reduce((sum, order) => sum + (order.quantity * (order.menuItemId?.price || 0)), 0).toFixed(2)}
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ p: 0 }}>
                                                    <List dense disablePadding>
                                                        {r.foodOrders.map((order, idx) => (
                                                            <ListItem key={idx} disablePadding>
                                                                <ListItemText 
                                                                    primary={`${order.quantity}x ${order.menuItemId?.name || 'Item'}`}
                                                                    secondary={`$${(order.menuItemId?.price || 0).toFixed(2)}`}
                                                                    primaryTypographyProps={{ variant: 'caption' }}
                                                                    secondaryTypographyProps={{ variant: 'caption' }}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </AccordionDetails>
                                            </Accordion>
                                        ) : (
                                            <Typography variant="caption" color="textSecondary">No orders</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="error" 
                                            size="small"
                                            onClick={() => handleDelete(r._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}
