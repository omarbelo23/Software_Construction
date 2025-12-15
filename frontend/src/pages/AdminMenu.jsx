import { useEffect, useState } from "react";
import { getMenu } from "../api/menuApi.js";
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from "@mui/material";

export default function AdminMenu() {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        getMenu()
            .then(res => setMenu(res.data))
            .catch(err => console.error("Error loading menu:", err));
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Menu Items
            </Typography>

            {menu.length === 0 ? (
                <Paper sx={{ p: 3 }}>
                    <Typography>No menu items found</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Category</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menu.map(item => (
                                <TableRow key={item._id} hover>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>${item.price}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={item.isAvailable ? "Available" : "Unavailable"} 
                                            color={item.isAvailable ? "success" : "default"}
                                            size="small"
                                        />
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
