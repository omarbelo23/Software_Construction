import { useEffect, useState } from "react";
import { listAllReservations } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminReservations() {
    const { token } = useAuth();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        listAllReservations(token)
            .then(res => setReservations(res.data))
            .catch(err => console.error("Error loading reservations:", err));
    }, []);

    return (
        <div>
            <h2>All Reservations</h2>
            {reservations.length === 0 ? (
                <p>No reservations found</p>
            ) : (
                <ul>
                    {reservations.map(r => (
                        <li key={r._id}>
                            <strong>{r.date} {r.time}</strong> — Party Size: {r.partySize} — User: {r.userId}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
