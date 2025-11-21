import { useEffect, useState } from "react";
import { listUserReservations } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
    const { token, user } = useAuth();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        listUserReservations(token)
            .then((res) => setReservations(res.data))
            .catch((err) => console.error("Error loading reservations:", err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Welcome, {user?.name}</h2>
            <p>Your Dashboard</p>

            <hr />

            <h3>Your Reservations</h3>

            {reservations.length === 0 ? (
                <p>You have no reservations yet.</p>
            ) : (
                <ul>
                    {reservations.map((r) => (
                        <li key={r._id} style={{ marginBottom: "10px" }}>
                            <strong>{r.date} at {r.time}</strong>
                            <br />
                            Party Size: {r.partySize}
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h3>Quick Actions</h3>
            <ul>
                <li><Link to="/reserve">Make a Reservation</Link></li>
                <li><Link to="/menu">Browse Menu</Link></li>
                <li><Link to="/feedback">Leave Feedback</Link></li>
            </ul>
        </div>
    );
}
