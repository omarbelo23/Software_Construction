import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation, getUnavailableSlots } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReservationPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ date: "", time: "", partySize: 2 });
    const [unavailableSlots, setUnavailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Generate time slots from 10:00 AM to 10:00 PM in 30-minute intervals
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 22; hour++) {
            for (let minute of [0, 30]) {
                if (hour === 22 && minute === 30) break; // Stop at 10:00 PM
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const isPM = hour >= 12;
                const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                const timeLabel = `${hour12}:${minute.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
                slots.push({ value: time24, label: timeLabel });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Fetch unavailable slots when date changes
    useEffect(() => {
        const fetchUnavailableSlots = async () => {
            if (!form.date) {
                setUnavailableSlots([]);
                return;
            }

            setLoadingSlots(true);
            try {
                const response = await getUnavailableSlots(form.date);
                setUnavailableSlots(response.data.unavailableSlots || []);
                // Clear selected time if it becomes unavailable
                if (form.time && response.data.unavailableSlots?.includes(form.time)) {
                    setForm(prev => ({ ...prev, time: "" }));
                }
            } catch (error) {
                console.error("Failed to fetch unavailable slots:", error);
                setUnavailableSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchUnavailableSlots();
    }, [form.date]);

    const isSlotUnavailable = (timeValue) => {
        return unavailableSlots.includes(timeValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.time) {
            alert("Please select a time slot");
            return;
        }
        try {
            await createReservation(token, form);
            alert("Reservation created successfully!");
            navigate("/");
        } catch (error) {
            alert("Failed to create reservation: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Create Reservation</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="date">Select Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Select Time {loadingSlots && <span className="text-muted-foreground">(Loading...)</span>}</Label>
                            <p className="text-sm text-muted-foreground">
                                Grey slots are fully booked (max 5 reservations per time slot)
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {timeSlots.map((slot) => {
                                    const isUnavailable = isSlotUnavailable(slot.value);
                                    return (
                                        <Button
                                            key={slot.value}
                                            type="button"
                                            variant={form.time === slot.value ? "default" : "outline"}
                                            className={`w-full ${isUnavailable ? "opacity-50 cursor-not-allowed bg-gray-300 hover:bg-gray-300 text-gray-500" : ""}`}
                                            onClick={() => !isUnavailable && setForm({ ...form, time: slot.value })}
                                            disabled={isUnavailable}
                                        >
                                            {slot.label}
                                        </Button>
                                    );
                                })}
                            </div>
                            {form.time && (
                                <p className="text-sm text-muted-foreground">
                                    Selected: <span className="font-semibold">{timeSlots.find(s => s.value === form.time)?.label}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="partySize">Party Size</Label>
                            <Input
                                id="partySize"
                                type="number"
                                min="1"
                                max="20"
                                value={form.partySize}
                                onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value) })}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Reserve Table
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
