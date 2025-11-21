import { useState } from "react";
import { submitFeedback } from "../api/feedbackApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function FeedbackPage() {
    const { token } = useAuth();
    const [form, setForm] = useState({ reservationId: "", rating: 5, comment: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitFeedback(token, form);
        alert("Feedback submitted");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Submit Feedback</h2>
            <input placeholder="Reservation ID" onChange={(e)=>setForm({...form,reservationId:e.target.value})}/>
            <input placeholder="Rating" onChange={(e)=>setForm({...form,rating:e.target.value})}/>
            <input placeholder="Comment" onChange={(e)=>setForm({...form,comment:e.target.value})}/>
            <button>Submit</button>
        </form>
    );
}
