import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

export default function ReservationPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ date: "", time: "", partySize: 2 });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createReservation(token, form);
            alert("Reservation created successfully!");
            navigate("/");
        } catch (error) {
            alert("Failed to create reservation: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Create Reservation
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Select Date"
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        required
                        fullWidth
                    />

                    <TextField
                        select
                        label="Select Time"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        required
                        fullWidth
                    >
                        <MenuItem value="">Choose a time slot</MenuItem>
                        {timeSlots.map((slot) => (
                            <MenuItem key={slot.value} value={slot.value}>
                                {slot.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Party Size"
                        type="number"
                        value={form.partySize}
                        onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value) })}
                        inputProps={{ min: 1, max: 20 }}
                        required
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Reserve Table
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
