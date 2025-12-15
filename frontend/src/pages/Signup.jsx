import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi.js";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export default function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "", adminCode: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(form);
            alert("Signup successful! Please login with your credentials.");
            navigate("/login");
        } catch (error) {
            alert("Signup failed: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Signup
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="adminCode"
                        label="Admin Code (optional)"
                        type="text"
                        id="adminCode"
                        value={form.adminCode}
                        onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
                        helperText="Leave blank for customer account. Enter admin code for admin access."
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Signup
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
