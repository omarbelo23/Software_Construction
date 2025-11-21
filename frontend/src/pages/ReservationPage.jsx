import { useState } from "react";
import { createReservation } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ReservationPage() {
    const { token } = useAuth();
    const [form, setForm] = useState({ date: "", time: "", partySize: 2 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createReservation(token, form);
        alert("Reservation created");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Reservation</h2>
            <input placeholder="Date" onChange={(e)=>setForm({...form,date:e.target.value})}/>
            <input placeholder="Time" onChange={(e)=>setForm({...form,time:e.target.value})}/>
            <input placeholder="Party Size" onChange={(e)=>setForm({...form,partySize:e.target.value})}/>
            <button>Reserve</button>
        </form>
    );
}
