import React, { useEffect, useState } from "react";
import { listAllReservations } from "../api/reservationApi.js";
import { listFeedback } from "../api/feedbackApi.js";
import { getMenu } from "../api/menuApi.js";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * AdminDashboard.jsx
 * Fully connected admin dashboard that reads real data from your backend.
 *
 * Requirements:
 *  - AuthProvider must be mounted (so useAuth() returns { token, user }).
 *  - Backend running at http://localhost:5000 (as in your project).
 *  - Endpoints: /api/reservations/all, /api/feedback/all, /api/menu
 */

export default function AdminDashboard() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        reservations: 0,
        customers: 0, // estimated from reservations' unique users if user collection route missing
        menuItems: 0,
        feedback: 0,
    });

    const [reservations, setReservations] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;
        async function loadAll() {
            setLoading(true);
            setError("");
            try {
                // Parallel requests
                const [resRes, resFb, resMenu] = await Promise.allSettled([
                    listAllReservations(token),
                    listFeedback(token),
                    getMenu(),
                ]);

                // Reservations
                if (resRes.status === "fulfilled") {
                    const items = Array.isArray(resRes.value.data)
                        ? resRes.value.data
                        : [];
                    if (!cancelled) setReservations(items);

                    // estimate customers count (unique userId) if user endpoint not available
                    const uniqueUsers = new Set(items.map((r) => r.userId || r.user?._id));
                    if (!cancelled)
                        setStats((s) => ({ ...s, reservations: items.length, customers: uniqueUsers.size }));
                } else {
                    console.error("Reservations load error:", resRes.reason);
                    if (!cancelled) setError("Failed to load reservations.");
                }

                // Feedback
                if (resFb.status === "fulfilled") {
                    const fb = Array.isArray(resFb.value.data) ? resFb.value.data : [];
                    if (!cancelled) setFeedback(fb);
                    if (!cancelled) setStats((s) => ({ ...s, feedback: fb.length }));
                } else {
                    console.error("Feedback load error:", resFb.reason);
                    if (!cancelled && !error) setError("Failed to load feedback.");
                }

                // Menu
                if (resMenu.status === "fulfilled") {
                    const m = Array.isArray(resMenu.value.data) ? resMenu.value.data : [];
                    if (!cancelled) setMenu(m);
                    if (!cancelled) setStats((s) => ({ ...s, menuItems: m.length }));
                } else {
                    console.error("Menu load error:", resMenu.reason);
                    if (!cancelled && !error) setError("Failed to load menu.");
                }
            } catch (err) {
                console.error("Dashboard error:", err);
                if (!cancelled) setError("Unexpected error while loading dashboard.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadAll();
        return () => {
            cancelled = true;
        };
    }, [token]);

    // Simple UI helpers
    const formatDate = (d) => {
        if (!d) return "-";
        try {
            const dt = new Date(d);
            return dt.toLocaleString();
        } catch {
            return d;
        }
    };

    if (!token) {
        return (
            <div className="admin-theme min-h-screen p-6">
                <div className="max-w-4xl mx-auto card">
                    <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
                    <p className="text-sm text-gray-300">You must be logged in as admin to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-theme min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold admin-accent">Admin Dashboard</h1>
                        <p className="text-sm text-gray-300 mt-1">Overview — reservations, feedback and menu</p>
                    </div>
                </header>

                {loading ? (
                    <div className="card p-6">
                        <div className="text-center">Loading dashboard...</div>
                    </div>
                ) : error ? (
                    <div className="card p-6">
                        <div className="text-red-400">Error: {error}</div>
                    </div>
                ) : (
                    <>
                        {/* Metrics */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="card bg-[#0b1220] p-4">
                                <div className="text-sm text-gray-400">Reservations</div>
                                <div className="text-2xl font-semibold mt-1">{stats.reservations}</div>
                            </div>

                            <div className="card bg-[#0b1220] p-4">
                                <div className="text-sm text-gray-400">Unique Customers</div>
                                <div className="text-2xl font-semibold mt-1">{stats.customers}</div>
                            </div>

                            <div className="card bg-[#0b1220] p-4">
                                <div className="text-sm text-gray-400">Menu Items</div>
                                <div className="text-2xl font-semibold mt-1">{stats.menuItems}</div>
                            </div>

                            <div className="card bg-[#0b1220] p-4">
                                <div className="text-sm text-gray-400">Feedback</div>
                                <div className="text-2xl font-semibold mt-1">{stats.feedback}</div>
                            </div>
                        </section>

                        {/* Tables: Reservations + Feedback */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-medium">Recent Reservations</h2>
                                </div>

                                {reservations.length === 0 ? (
                                    <div className="text-sm text-gray-400">No reservations yet.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left">
                                            <thead>
                                            <tr className="text-gray-400 border-b border-gray-700">
                                                <th className="py-2 px-2">Customer</th>
                                                <th className="py-2 px-2">Date</th>
                                                <th className="py-2 px-2">Time</th>
                                                <th className="py-2 px-2">Party</th>
                                                <th className="py-2 px-2">Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {reservations.slice(0, 10).map((r) => (
                                                <tr key={r._id} className="odd:bg-white/2 even:bg-white/1">
                                                    <td className="py-2 px-2">
                                                        {r.userName || r.user?.name || r.userId || "—"}
                                                    </td>
                                                    <td className="py-2 px-2">{r.date}</td>
                                                    <td className="py-2 px-2">{r.time || formatDate(r.createdAt)}</td>
                                                    <td className="py-2 px-2">{r.partySize ?? r.guests ?? "-"}</td>
                                                    <td className="py-2 px-2">{r.status || "confirmed"}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-medium">Recent Feedback</h2>
                                </div>

                                {feedback.length === 0 ? (
                                    <div className="text-sm text-gray-400">No feedback yet.</div>
                                ) : (
                                    <div className="space-y-3 max-h-[420px] overflow-y-auto">
                                        {feedback.slice(0, 10).map((f) => (
                                            <div key={f._id} className="p-3 rounded border border-gray-800">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div>
                                                        <div className="font-semibold">{f.userName || f.user?.name || f.userId}</div>
                                                        <div className="text-sm text-gray-400">{f.rating} ★ — {f.reservationId || ""}</div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{formatDate(f.createdAt)}</div>
                                                </div>

                                                <p className="mt-2 text-sm text-gray-300">{f.comment || f.message || "-"}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Menu preview */}
                        <section className="card p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-medium">Menu Preview</h2>
                            </div>

                            {menu.length === 0 ? (
                                <div className="text-sm text-gray-400">No menu items.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {menu.slice(0, 9).map((m) => (
                                        <div key={m._id} className="p-3 border rounded">
                                            <div className="font-semibold">{m.name}</div>
                                            <div className="text-sm text-gray-400">{m.category || "—"}</div>
                                            <div className="mt-2 font-medium">${m.price}</div>
                                            <div className="text-xs mt-1">{m.isAvailable ? "Available" : "Unavailable"}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
