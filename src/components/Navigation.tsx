import { cn } from "@/lib/utils";
import {
  Headphones,
  User,
  Upload,
  Disc3,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userType, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { href: "/discover", icon: Disc3, label: "Discover" },
    { href: "/upload", icon: Upload, label: "Upload" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between backdrop-blur-xl bg-card/40 rounded-2xl border border-border/20 px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Headphones className="w-8 h-8 text-neon-violet transition-all duration-300 group-hover:text-neon-teal" />
              <div className="absolute inset-0 blur-lg bg-neon-violet/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-heading font-semibold text-xl text-gradient">
              Blind Drop
            </span>
          </Link>

          {/* Nav Links & Auth */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {links.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-ui text-sm",
                      isActive
                        ? "bg-primary/20 text-primary shadow-neon border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="h-6 w-px bg-border/40"></div>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to={`/dashboard/${userType}`}>
                  <Button variant="ghost_neon" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="primary" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
