import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
    const { token, user, logout } = useAuth();

    return (
        <nav style={{ padding: "10px", background: "#f3f3f3" }}>
            {token ? (
                <>
                    {user.role === "customer" && (
                        <>
                            <Link to="/">Dashboard</Link> |
                            <Link to="/reserve">Reserve</Link> |
                            <Link to="/menu">Menu</Link> |
                            <Link to="/feedback">Feedback</Link>
                        </>
                    )}

                    {user.role === "admin" && (
                        <>
                            <Link to="/admin">Admin Dashboard</Link> |
                            <Link to="/admin/reservations">Reservations</Link> |
                            <Link to="/admin/menu">Menu</Link> |
                            <Link to="/admin/feedback">Feedback</Link>
                        </>
                    )}

                    <button onClick={logout} style={{ marginLeft: 10 }}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link> |
                    <Link to="/signup">Signup</Link>
                </>
            )}
        </nav>
    );
}
