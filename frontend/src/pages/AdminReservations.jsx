import { useEffect, useState } from "react";
import { listAllReservations, deleteReservation } from "../api/reservationApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdminReservations() {
    const { token } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        date: "",
        time: "",
        userName: ""
    });

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

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = () => {
        setLoading(true);
        listAllReservations(token)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setReservations(data);
                setFilteredReservations(data); // Show all by default
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading reservations:", err);
                setLoading(false);
            });
    };

    const applyFilters = () => {
        let filtered = [...reservations];

        // Filter by date (only if filter is set)
        if (filters.date) {
            filtered = filtered.filter(r => r.date === filters.date);
        }

        // Filter by time (only if filter is set)
        if (filters.time) {
            filtered = filtered.filter(r => r.time === filters.time);
        }

        // Filter by user name (only if filter is set, case insensitive, partial match)
        if (filters.userName) {
            filtered = filtered.filter(r =>
                (r.user?.name || "").toLowerCase().includes(filters.userName.toLowerCase())
            );
        }

        setFilteredReservations(filtered);
    };

    const clearFilters = () => {
        setFilters({
            date: "",
            time: "",
            userName: ""
        });
        setFilteredReservations(reservations); // Reset to show all
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reservation?")) return;
        try {
            await deleteReservation(token, id);
            // Refresh list
            loadReservations();
        } catch (err) {
            alert("Failed to delete reservation: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return <div className="container mx-auto py-8"><p>Loading reservations...</p></div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">All Reservations</h1>
            <p className="text-muted-foreground mb-6">
                Total: {reservations.length} | Showing: {filteredReservations.length}
            </p>

            {/* Filters Section */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <Label htmlFor="filter-date">Date</Label>
                            <Input
                                id="filter-date"
                                type="date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="filter-time">Time</Label>
                            <Select
                                value={filters.time}
                                onValueChange={(value) => setFilters({ ...filters, time: value })}
                            >
                                <SelectTrigger id="filter-time">
                                    <SelectValue placeholder="All Times" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Times</SelectItem>
                                    {timeSlots.map((slot) => (
                                        <SelectItem key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="filter-userName">User Name</Label>
                            <Input
                                id="filter-userName"
                                placeholder="Search by name..."
                                value={filters.userName}
                                onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={applyFilters}>
                            Apply Filters
                        </Button>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Reservations Table */}
            {filteredReservations.length === 0 ? (
                <p className="text-muted-foreground">No reservations found with the current filters.</p>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Party Size</TableHead>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead>Customer Email</TableHead>
                                    <TableHead>Food Orders</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReservations.map(r => (
                                    <TableRow key={r._id}>
                                        <TableCell>{r.date}</TableCell>
                                        <TableCell>{r.time}</TableCell>
                                        <TableCell>{r.partySize}</TableCell>
                                        <TableCell>{r.user?.name || 'N/A'}</TableCell>
                                        <TableCell className="text-muted-foreground">{r.user?.email || 'N/A'}</TableCell>
                                        <TableCell>
                                            {r.foodOrders && r.foodOrders.length > 0 ? (
                                                <Accordion type="single" collapsible className="border-0">
                                                    <AccordionItem value="item-1" className="border-0">
                                                        <AccordionTrigger className="py-0 hover:no-underline">
                                                            <span className="text-sm text-primary">
                                                                {r.foodOrders.length} item(s) - Total: ${r.foodOrders.reduce((sum, order) => sum + (order.quantity * (order.menuItemId?.price || 0)), 0).toFixed(2)}
                                                            </span>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="space-y-1 pt-2">
                                                                {r.foodOrders.map((order, idx) => (
                                                                    <div key={idx} className="text-xs">
                                                                        <p className="font-medium">{order.quantity}x {order.menuItemId?.name || 'Item'}</p>
                                                                        <p className="text-muted-foreground">${(order.menuItemId?.price || 0).toFixed(2)}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No orders</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(r._id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
