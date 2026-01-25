import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Topbar } from "../../components/topbar";
import { useAuth } from "../../store/auth";
import { NAV_ITEMS } from "../../constants";

import styles from "./dashboard.layout.module.css";

export const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    // Guard already handles this, but safety fallback
    return null;
  }

  const navItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role as any)
  );

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>SaaS</div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <div
                key={item.path}
                className={`${styles.navItem} ${
                  isActive ? styles.navItemActive : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <Topbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
