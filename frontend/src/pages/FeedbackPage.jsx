import { useState } from "react";
import { submitFeedback } from "../api/feedbackApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Rating
} from "@mui/material";

export default function FeedbackPage() {
    const { token } = useAuth();
    const [form, setForm] = useState({ reservationId: "", rating: 5, comment: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitFeedback(token, form);
            alert("Feedback submitted");
            setForm({ reservationId: "", rating: 5, comment: "" });
        } catch (error) {
            console.error("Error submitting feedback", error);
            alert("Failed to submit feedback");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Submit Feedback
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    We value your opinion! Please let us know about your experience.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Reservation ID"
                            variant="outlined"
                            fullWidth
                            required
                            value={form.reservationId}
                            onChange={(e) => setForm({ ...form, reservationId: e.target.value })}
                            helperText="Enter the ID of your reservation"
                        />

                        <Box>
                            <Typography component="legend">Rating</Typography>
                            <Rating
                                name="rating"
                                value={Number(form.rating)}
                                onChange={(event, newValue) => {
                                    setForm({ ...form, rating: newValue });
                                }}
                            />
                        </Box>

                        <TextField
                            label="Comment"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                        />

                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large" 
                            fullWidth
                        >
                            Submit Feedback
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}
