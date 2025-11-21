import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout({ children }) {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    return (
        <div className={isAdmin ? "admin-theme min-h-screen" : "customer-theme min-h-screen"}>
            <Navbar />

            {/* Shared page container */}
            <main className="px-4 py-6 max-w-5xl mx-auto">
                {children}
            </main>
        </div>
    );
}
