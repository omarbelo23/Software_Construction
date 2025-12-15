import React, { useEffect, useState } from "react";
import { getMenu } from "../api/menuApi";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Box,
    CircularProgress
} from "@mui/material";

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
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading menu...</Typography>
            </Container>
        );
    }

    if (menu.length === 0) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>Menu</Typography>
                <Typography>No menu items available.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" align="center">
                Our Menu
            </Typography>

            <Grid container spacing={3}>
                {menu.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="h5" component="div">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {item.price} EGP
                                    </Typography>
                                </Box>

                                <Typography color="text.secondary" gutterBottom>
                                    {item.category}
                                </Typography>

                                {item.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {item.description}
                                    </Typography>
                                )}

                                <Box sx={{ mt: 2 }}>
                                    <Chip
                                        label={item.isAvailable ? "Available" : "Not Available"}
                                        color={item.isAvailable ? "success" : "error"}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
