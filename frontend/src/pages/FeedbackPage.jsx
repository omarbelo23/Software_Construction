import { useState } from "react";
import { submitFeedback } from "../api/feedbackApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackPage() {
    const { token } = useAuth();
    const [form, setForm] = useState({ reservationId: "", rating: 5, comment: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitFeedback(token, form);
            alert("Feedback submitted");
            setForm({ reservationId: "", rating: 5, comment: "" });
        } catch (error) {
            console.error("Error submitting feedback", error);
            alert("Failed to submit feedback");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Submit Feedback</CardTitle>
                    <CardDescription className="text-center">
                        We value your opinion! Please let us know about your experience.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reservationId">Reservation ID</Label>
                            <Input
                                id="reservationId"
                                value={form.reservationId}
                                onChange={(e) => setForm({ ...form, reservationId: e.target.value })}
                                required
                            />
                            <p className="text-sm text-muted-foreground">Enter the ID of your reservation</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating (1-5)</Label>
                            <Input
                                id="rating"
                                type="number"
                                min="1"
                                max="5"
                                value={form.rating}
                                onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                rows={4}
                                value={form.comment}
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Submit Feedback
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
