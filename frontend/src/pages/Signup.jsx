import { useState } from "react";
import { signup } from "../api/authApi.js";

export default function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(form);
        alert("Signup successful");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
            <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
            <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
            <button>Signup</button>
        </form>
    );
}
