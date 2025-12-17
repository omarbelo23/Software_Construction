import { useEffect, useState } from "react";
import { listFeedback } from "../api/feedbackApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminFeedback() {
    const { token } = useAuth();
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        listFeedback(token)
            .then(res => setFeedback(res.data))
            .catch(err => console.error("Error loading feedback:", err));
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">All Feedback</h1>

            {feedback.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">No feedback found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedback.map(f => (
                        <Card key={f._id}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <Badge variant="default">Rating: {f.rating}/5</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        User: {f.userId?.name || "Unknown"}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 italic">"{f.comment}"</p>

                                <div className="text-sm text-muted-foreground space-y-2">
                                    <div className="font-semibold text-foreground">Reservation Details:</div>
                                    {f.reservationId ? (
                                        <>
                                            <p>Date: {f.reservationId.date}</p>
                                            <p>Time: {f.reservationId.time}</p>

                                            {f.reservationId.foodOrders && f.reservationId.foodOrders.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="font-semibold text-foreground mb-1">Food Orders:</p>
                                                    <ul className="list-disc list-inside">
                                                        {f.reservationId.foodOrders.map((order, idx) => (
                                                            <li key={idx}>
                                                                {order.quantity}x {order.menuItemId?.name || "Item"}
                                                                {order.menuItemId?.price && ` ($${(order.menuItemId.price * order.quantity).toFixed(2)})`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>Reservation details unavailable</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
