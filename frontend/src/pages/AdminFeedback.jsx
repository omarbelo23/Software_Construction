import { useEffect, useState } from "react";
import { listFeedback } from "../api/feedbackApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Rating,
    Box
} from "@mui/material";

export default function AdminFeedback() {
    const { token } = useAuth();
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        listFeedback(token)
            .then(res => setFeedback(res.data))
            .catch(err => console.error("Error loading feedback:", err));
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                All Feedback
            </Typography>

            {feedback.length === 0 ? (
                <Paper sx={{ p: 3 }}>
                    <Typography>No feedback found</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {feedback.map(f => (
                        <Grid item xs={12} md={6} key={f._id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Rating value={f.rating} readOnly />
                                        <Typography variant="caption" color="text.secondary">
                                            User: {f.userId}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" gutterBottom>
                                        {f.comment}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Reservation ID: {f.reservationId}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
