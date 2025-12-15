import React, { useEffect, useState } from "react";
import { listAllReservations } from "../api/reservationApi.js";
import { listFeedback } from "../api/feedbackApi.js";
import { getMenu } from "../api/menuApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip
} from "@mui/material";
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
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary">
            You must be logged in as admin to view this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview — reservations, feedback and menu
        </Typography>
      </Box>

      {loading ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>Loading dashboard...</Typography>
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      ) : (
        <>
          {/* Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'primary.dark', color: 'white' }}>
                <Typography variant="h6" gutterBottom>Reservations</Typography>
                <Typography variant="h3" component="div" sx={{ mt: 'auto' }}>
                  {stats.reservations}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'secondary.dark', color: 'white' }}>
                <Typography variant="h6" gutterBottom>Unique Customers</Typography>
                <Typography variant="h3" component="div" sx={{ mt: 'auto' }}>
                  {stats.customers}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'success.dark', color: 'white' }}>
                <Typography variant="h6" gutterBottom>Menu Items</Typography>
                <Typography variant="h3" component="div" sx={{ mt: 'auto' }}>
                  {stats.menuItems}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'warning.dark', color: 'white' }}>
                <Typography variant="h6" gutterBottom>Feedback</Typography>
                <Typography variant="h3" component="div" sx={{ mt: 'auto' }}>
                  {stats.feedback}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Tables: Reservations + Feedback */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Recent Reservations
                </Typography>
                {reservations.length === 0 ? (
                  <Typography color="text.secondary">No reservations yet.</Typography>
                ) : (
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Customer</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Party</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reservations.slice(0, 10).map((r) => (
                          <TableRow key={r._id}>
                            <TableCell>{r.userName || r.user?.name || r.userId || "—"}</TableCell>
                            <TableCell>{r.date}</TableCell>
                            <TableCell>{r.time || formatDate(r.createdAt)}</TableCell>
                            <TableCell>{r.partySize ?? r.guests ?? "-"}</TableCell>
                            <TableCell>
                              <Chip 
                                label={r.status || "confirmed"} 
                                size="small" 
                                color={r.status === 'cancelled' ? 'error' : 'success'} 
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Recent Feedback
                </Typography>
                {feedback.length === 0 ? (
                  <Typography color="text.secondary">No feedback yet.</Typography>
                ) : (
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {feedback.slice(0, 10).map((f) => (
                      <Card key={f._id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {f.userName || f.user?.name || f.userId}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {f.rating} ★ — {f.reservationId || ""}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(f.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {f.comment || f.message || "-"}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography component="h2" variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/admin/reservations" 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  sx={{ height: '100%' }}
                >
                  Manage Reservations
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/admin/menu" 
                  variant="contained" 
                  color="success" 
                  fullWidth 
                  size="large"
                  sx={{ height: '100%' }}
                >
                  Manage Menu
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/admin/feedback" 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  size="large"
                  sx={{ height: '100%' }}
                >
                  View Feedback
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/admin/users" 
                  variant="contained" 
                  color="warning" 
                  fullWidth 
                  size="large"
                  sx={{ height: '100%' }}
                >
                  View Users
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Menu preview */}
          <Paper sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" gutterBottom>
              Menu Preview
            </Typography>
            {menu.length === 0 ? (
              <Typography color="text.secondary">No menu items.</Typography>
            ) : (
              <Grid container spacing={2}>
                {menu.slice(0, 6).map((m) => (
                  <Grid item xs={12} sm={6} md={4} key={m._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {m.name}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {m.category || "—"}
                        </Typography>
                        <Typography variant="body2">
                          ${m.price}
                        </Typography>
                        <Chip 
                          label={m.isAvailable ? "Available" : "Unavailable"} 
                          color={m.isAvailable ? "success" : "default"} 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
}
