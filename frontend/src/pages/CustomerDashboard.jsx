import { useEffect, useState } from "react";
import { listUserReservations, deleteReservation } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FeedbackModal from "../components/FeedbackModal";

export default function CustomerDashboard() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = () => {
        listUserReservations(token)
            .then((res) => setReservations(res.data))
            .catch((err) => console.error("Error loading reservations:", err));
    };

    const handleDelete = async (reservationId) => {
        if (!confirm("Are you sure you want to delete this reservation?")) {
            return;
        }

        try {
            await deleteReservation(token, reservationId);
            alert("Reservation deleted successfully!");
            loadReservations(); // Reload the list
        } catch (error) {
            alert("Failed to delete reservation: " + (error.response?.data?.message || error.message));
        }
    };

    const handleFeedback = (reservationId) => {
        setSelectedReservationId(reservationId);
        setIsFeedbackOpen(true);
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground mb-6">Your Dashboard</p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-semibold mb-4">Your Reservations</h2>

            {reservations.length === 0 ? (
                <p className="text-muted-foreground">You have no reservations yet.</p>
            ) : (
                <div className="space-y-4">
                    {reservations.map((r) => (
                        <Card key={r._id}>
                            <CardHeader>
                                <CardTitle>
                                    {r.date} at {r.time}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Party Size: {r.partySize || r.size || 'Not specified'}
                                </p>
                            </CardHeader>

                            {r.foodOrders && r.foodOrders.length > 0 && (
                                <CardContent>
                                    <p className="text-sm font-semibold text-primary mb-2">Food Orders:</p>
                                    <ul className="space-y-1">
                                        {r.foodOrders.map((order, idx) => (
                                            <li key={idx} className="text-sm flex justify-between">
                                                <span>{order.quantity}x {order.menuItemId?.name || 'Item'}</span>
                                                {order.menuItemId?.price && (
                                                    <span>${(order.menuItemId.price * order.quantity).toFixed(2)}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-sm font-bold mt-2">
                                        Total: ${r.foodOrders.reduce((sum, order) => sum + (order.quantity * (order.menuItemId?.price || 0)), 0).toFixed(2)}
                                    </p>
                                </CardContent>
                            )}

                            <CardFooter className="gap-2">
                                <Button
                                    size="sm"
                                    variant="blue"
                                    onClick={() => navigate(`/order-food/${r._id}`)}
                                >
                                    Order Food
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleFeedback(r._id)}
                                >
                                    Feedback
                                </Button>
                                <Button
                                    size="sm"
                                    variant="red"
                                    onClick={() => handleDelete(r._id)}
                                >
                                    Delete Reservation
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <Separator className="my-6" />

            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-3">
                <Button asChild size="lg" variant="secondary" className="h-auto py-4 justify-start">
                    <Link to="/reserve">
                        <p className="font-medium">Make a Reservation</p>
                    </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="h-auto py-4 justify-start">
                    <Link to="/menu">
                        <p className="font-medium">Browse Menu</p>
                    </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="h-auto py-4 justify-start">
                    <Link to="/feedback">
                        <p className="font-medium">Leave Feedback</p>
                    </Link>
                </Button>
            </div>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                reservationId={selectedReservationId}
            />
        </div>
    );
}
