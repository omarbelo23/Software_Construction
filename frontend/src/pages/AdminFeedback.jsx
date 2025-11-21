import { useEffect, useState } from "react";
import { listFeedback } from "../api/feedbackApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminFeedback() {
    const { token } = useAuth();
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        listFeedback(token)
            .then(res => setFeedback(res.data))
            .catch(err => console.error("Error loading feedback:", err));
    }, []);

    return (
        <div>
            <h2>All Feedback</h2>

            {feedback.length === 0 ? (
                <p>No feedback found</p>
            ) : (
                <ul>
                    {feedback.map(f => (
                        <li key={f._id} style={{ marginBottom: "10px" }}>
                            <strong>Rating: {f.rating}</strong>
                            <br />
                            Comment: {f.comment}
                            <br />
                            Reservation ID: {f.reservationId}
                            <br />
                            User ID: {f.userId}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
