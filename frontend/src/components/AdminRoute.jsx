import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" />;
    if (user.role !== "admin") return <Navigate to="/" />;
    return children;
}
