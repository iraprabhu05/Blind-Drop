import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Music, BarChart, User, Upload, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { artistProfile } from "./mock-data";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../contexts/AuthContext";

const navLinks = [
  { name: "Overview", path: "overview", icon: Home },
  { name: "My Tracks", path: "tracks", icon: Music },
  { name: "Upload Track", path: "upload", icon: Upload },
  { name: "Analytics", path: "analytics", icon: BarChart },
  { name: "Profile", path: "profile", icon: User },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-card p-6 flex flex-col h-screen border-r border-border flex-shrink-0">
      <div className="flex items-center gap-4 mb-10">
        <Avatar className="w-12 h-12 border-2 border-primary">
          <AvatarImage src={artistProfile.avatar} alt={artistProfile.name} />
          <AvatarFallback>{artistProfile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {artistProfile.name}
          </h2>
          <p className="text-xs text-muted-foreground">Creator Studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            <link.icon size={18} />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={logout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
