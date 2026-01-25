import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/auth';

type Props = {
  allowedRoles: string[];
};

export const RequireRole = ({ allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Checking permissions…</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
