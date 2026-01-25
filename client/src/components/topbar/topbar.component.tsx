import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { logout } from '../../utils/auth/logout.util';

import styles from './topbar.module.css';

export const Topbar = () => {
  const navigate = useNavigate();
  const { user, setAuthState } = useAuth();

  const handleLogout = () => {
    logout(setAuthState);
    navigate('/login', { replace: true });
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.title}>Dashboard</div>

      <div className={styles.right}>
        {user && (
          <div className={styles.userInfo}>
            {user.email} ({user.role})
          </div>
        )}

        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
        >
          Logout
        </button>
      </div>
    </header>
  );
};
