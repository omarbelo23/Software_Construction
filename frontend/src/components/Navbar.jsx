import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle.jsx";
import { cn } from "@/lib/utils";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
    const { token, user, logout } = useAuth();
    const location = useLocation();
    const { theme } = useTheme();

    const NavItem = ({ to, children }) => {
        const isActive = location.pathname === to;
        const isDark = theme === "dark";

        return (
            <Button
                variant="ghost"
                className={cn(
                    "rounded-full transition-all h-10 px-6 text-base",
                    isActive && isDark && "bg-gray-700 text-foreground hover:bg-gray-700/80 shadow-none",
                    isActive && !isDark && "bg-gray-300 text-foreground hover:bg-gray-300/80 shadow-none",
                    !isActive && "text-muted-foreground hover:text-foreground"
                )}
                asChild
            >
                <RouterLink to={to}>{children}</RouterLink>
            </Button>
        );
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-center relative px-4">

                <div className="flex items-center gap-1 rounded-full border bg-background/50 p-1 shadow-sm">
                    {token ? (
                        <>
                            {user.role === "customer" && (
                                <>
                                    <NavItem to="/">Dashboard</NavItem>
                                    <NavItem to="/reserve">Reserve</NavItem>
                                    <NavItem to="/menu">Menu</NavItem>
                                    <NavItem to="/feedback">Feedback</NavItem>
                                </>
                            )}

                            {user.role === "admin" && (
                                <>
                                    <NavItem to="/admin">Dashboard</NavItem>
                                    <NavItem to="/admin/reservations">Reservations</NavItem>
                                    <NavItem to="/admin/menu">Menu</NavItem>
                                    <NavItem to="/admin/feedback">Feedback</NavItem>
                                    <NavItem to="/admin/users">Users</NavItem>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <NavItem to="/login">Login</NavItem>
                            <NavItem to="/signup">Signup</NavItem>
                        </>
                    )}
                </div>

                <div className="absolute right-4 flex items-center gap-2">
                    <ThemeToggle />
                    {token && (
                        <Button onClick={logout} variant="ghost" size="sm" className="rounded-full">
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
