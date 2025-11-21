import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";

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

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "signup", element: <Signup /> },
            { path: "login", element: <Login /> },

            { path: "dashboard", element: <CustomerDashboard /> },
            { path: "reserve", element: <ReservationPage /> },
            { path: "menu", element: <MenuPage /> },
            { path: "feedback", element: <FeedbackPage /> },

            { path: "admin", element: <AdminDashboard /> },
            { path: "admin/reservations", element: <AdminReservations /> },
            { path: "admin/menu", element: <AdminMenu /> },
            { path: "admin/feedback", element: <AdminFeedback /> },
        ],
    },
]);

export default router;
