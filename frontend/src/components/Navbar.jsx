import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function Navbar() {
    const { token, user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Restaurant App
                </Typography>
                {token ? (
                    <Box>
                        {user.role === "customer" && (
                            <>
                                <Button color="inherit" component={RouterLink} to="/">Dashboard</Button>
                                <Button color="inherit" component={RouterLink} to="/reserve">Reserve</Button>
                                <Button color="inherit" component={RouterLink} to="/menu">Menu</Button>
                                <Button color="inherit" component={RouterLink} to="/feedback">Feedback</Button>
                            </>
                        )}

                        {user.role === "admin" && (
                            <>
                                <Button color="inherit" component={RouterLink} to="/admin">Dashboard</Button>
                                <Button color="inherit" component={RouterLink} to="/admin/reservations">Reservations</Button>
                                <Button color="inherit" component={RouterLink} to="/admin/menu">Menu</Button>
                                <Button color="inherit" component={RouterLink} to="/admin/feedback">Feedback</Button>
                                <Button color="inherit" component={RouterLink} to="/admin/users">Users</Button>
                            </>
                        )}

                        <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                        <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
