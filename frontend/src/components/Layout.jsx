import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout({ children }) {
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="container mx-auto max-w-6xl py-8 flex-grow">
                {children}
            </main>
        </div>
    );
}
