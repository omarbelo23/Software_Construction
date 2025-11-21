import { useState } from "react";
import { login } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login: doLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(form);
        doLogin(res.data.token, res.data.user);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
            <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
            <button>Login</button>
        </form>
    );
}
