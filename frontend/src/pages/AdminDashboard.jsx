import React, { useEffect, useState } from "react";
import { listAllReservations } from "../api/reservationApi.js";
import { listFeedback } from "../api/feedbackApi.js";
import { getMenu } from "../api/menuApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link as RouterLink } from "react-router-dom";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    reservations: 0,
    customers: 0,
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
        const [resRes, resFb, resMenu] = await Promise.allSettled([
          listAllReservations(token),
          listFeedback(token),
          getMenu(),
        ]);

        if (resRes.status === "fulfilled") {
          const items = Array.isArray(resRes.value.data) ? resRes.value.data : [];
          if (!cancelled) setReservations(items);
          const uniqueUsers = new Set(items.map((r) => r.userId || r.user?._id));
          if (!cancelled)
            setStats((s) => ({ ...s, reservations: items.length, customers: uniqueUsers.size }));
        } else {
          console.error("Reservations load error:", resRes.reason);
          if (!cancelled) setError("Failed to load reservations.");
        }

        if (resFb.status === "fulfilled") {
          const fb = Array.isArray(resFb.value.data) ? resFb.value.data : [];
          if (!cancelled) setFeedback(fb);
          if (!cancelled) setStats((s) => ({ ...s, feedback: fb.length }));
        } else {
          console.error("Feedback load error:", resFb.reason);
          if (!cancelled && !error) setError("Failed to load feedback.");
        }

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
      <div className="container mx-auto max-w-xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You must be logged in as admin to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview — reservations, feedback and menu</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Loading dashboard...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stats.reservations}</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary text-secondary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Unique Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stats.customers}</p>
              </CardContent>
            </Card>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stats.menuItems}</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary text-secondary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stats.feedback}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tables: Reservations + Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Recent Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                {reservations.length === 0 ? (
                  <p className="text-muted-foreground">No reservations yet.</p>
                ) : (
                  <div className="max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Party</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.slice(0, 10).map((r) => (
                          <TableRow key={r._id}>
                            <TableCell>{r.userName || r.user?.name || (typeof r.userId === 'object' ? r.userId?.name : r.userId) || "—"}</TableCell>
                            <TableCell>{r.date}</TableCell>
                            <TableCell>{r.time || formatDate(r.createdAt)}</TableCell>
                            <TableCell>{r.partySize ?? r.guests ?? "-"}</TableCell>
                            <TableCell>
                              <Badge variant={r.status === 'cancelled' ? 'destructive' : 'default'}>
                                {r.status || "confirmed"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {feedback.length === 0 ? (
                  <p className="text-muted-foreground">No feedback yet.</p>
                ) : (
                  <div className="max-h-96 overflow-auto space-y-2">
                    {feedback.slice(0, 10).map((f) => (
                      <Card key={f._id} className="border">
                        <CardContent className="py-2 px-3">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-semibold text-sm">
                                {f.userName || f.user?.name || (typeof f.userId === 'object' ? f.userId?.name : f.userId) || "Anonymous"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {f.rating} ★ — {typeof f.reservationId === 'object' ? f.reservationId?._id : (f.reservationId || "")}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(f.createdAt)}
                            </p>
                          </div>
                          <p className="text-sm">
                            {f.comment || f.message || "-"}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild size="lg" className="h-auto py-4" variant="default">
                  <RouterLink to="/admin/reservations">Manage Reservations</RouterLink>
                </Button>
                <Button asChild size="lg" className="h-auto py-4" variant="secondary">
                  <RouterLink to="/admin/menu">Manage Menu</RouterLink>
                </Button>
                <Button asChild size="lg" className="h-auto py-4" variant="default">
                  <RouterLink to="/admin/feedback">View Feedback</RouterLink>
                </Button>
                <Button asChild size="lg" className="h-auto py-4" variant="secondary">
                  <RouterLink to="/admin/users">View Users</RouterLink>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Menu preview */}
          <Card>
            <CardHeader>
              <CardTitle>Menu Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {menu.length === 0 ? (
                <p className="text-muted-foreground">No menu items.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {menu.slice(0, 6).map((m) => (
                    <Card key={m._id} className="border">
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold">{m.name}</h3>
                        <p className="text-muted-foreground mb-2">{m.category || "—"}</p>
                        <p className="text-lg font-semibold">${m.price}</p>
                        <Badge className={`mt-2 ${m.isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
                          {m.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )
      }
    </div >
  );
}
