import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";

import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import ReservationPage from "./pages/ReservationPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminReservations from "./pages/AdminReservations.jsx";
import AdminMenu from "./pages/AdminMenu.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reserve"
                        element={
                            <ProtectedRoute>
                                <ReservationPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/menu"
                        element={
                            <ProtectedRoute>
                                <MenuPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/feedback"
                        element={
                            <ProtectedRoute>
                                <FeedbackPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* ADMIN ROUTES */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/reservations"
                        element={
                            <AdminRoute>
                                <AdminReservations />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/menu"
                        element={
                            <AdminRoute>
                                <AdminMenu />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/feedback"
                        element={
                            <AdminRoute>
                                <AdminFeedback />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
