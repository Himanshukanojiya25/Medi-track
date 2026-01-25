import { Route } from 'react-router-dom';
import { LoginPage } from '../pages/auth';

const ForbiddenPage = () => <div>403 — Forbidden</div>;

export const publicRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/403" element={<ForbiddenPage />} />
  </>
);
