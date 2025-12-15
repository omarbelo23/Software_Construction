import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "./Navbar.jsx";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function Layout({ children }) {
    const { user } = useAuth();
    // Theme handling is now done via ThemeProvider in main.jsx, 
    // but we can still use specific classes or styles if needed.
    
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {children}
            </Container>
        </Box>
    );
}
