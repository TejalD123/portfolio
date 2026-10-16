import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Briefcase, BookOpen, User, Mail, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ADMIN_PATH } from "../../utils/constants.js";

const links = [
  { to: ADMIN_PATH, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: `${ADMIN_PATH}/projects`, label: "Projects", icon: FolderKanban },
  { to: `${ADMIN_PATH}/experience`, label: "Experience", icon: Briefcase },
  { to: `${ADMIN_PATH}/case-studies`, label: "Case studies", icon: BookOpen },
  { to: `${ADMIN_PATH}/profile`, label: "Profile", icon: User },
  { to: `${ADMIN_PATH}/messages`, label: "Messages", icon: Mail },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(`${ADMIN_PATH}/login`);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 hidden md:flex flex-col card-surface border-r border-card-border p-6 sticky top-0 h-screen">
        <div className="font-display font-bold text-lg mb-1">
          TD<span className="text-rose">.</span> Admin
        </div>
        <p className="text-xs text-muted mb-8 truncate">{admin?.email}</p>

        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-gradient text-white"
                    : "text-secondary hover:bg-ink/5 dark:hover:bg-white/5"
                }`
              }
            >
              <l.icon size={16} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between pt-6 border-t border-card-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-secondary hover:text-rose transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}