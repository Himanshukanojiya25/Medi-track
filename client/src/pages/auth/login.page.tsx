import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './login.page.module.css';
import { apiClient } from '../../config';
import { useAuth } from '../../store/auth';
import { validateLogin, type LoginPayload } from './login.schema';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

  const [form, setForm] = useState<LoginPayload>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateLogin(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient.post('/auth/login', form);
      const { accessToken, user } = res.data?.data ?? {};

      if (!accessToken || !user?.role) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('access_token', accessToken);

      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });

      if (user.role === 'SUPER_ADMIN') {
        navigate('/super-admin', { replace: true });
      } else if (user.role === 'DOCTOR') {
        navigate('/doctor', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
      setLoading(false);
    }
  };

return (
  <>
    <h2 className={styles.title}>Login</h2>

    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="email@example.com"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
          className={styles.input}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? 'Logging in…' : 'Login'}
      </button>
    </form>
  </>
);

};
