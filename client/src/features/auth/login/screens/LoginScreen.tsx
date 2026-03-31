// client/src/features/auth/login/screens/LoginScreen.tsx

import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Stethoscope, Building2, User } from 'lucide-react';
import { useLogin } from '../../../../hooks/auth/useLogin';
import { LoginForm } from '../components/LoginForm';
import { getRoleFromQueryParam, getRoleTitle, getRoleDescription } from '../utils/login-redirect.util';

export function LoginScreen() {
  const [searchParams] = useSearchParams();
  const { login, isLoading, error } = useLogin({ redirectOnSuccess: true });

  const roleParam = searchParams.get('role');
  const [selectedRole] = useState<'patient' | 'doctor' | 'hospital'>(
    getRoleFromQueryParam(roleParam)
  );

  const handleSubmit = async (email: string, password: string) => {
    console.log('[LoginScreen] Submitting login for:', email);
    
    try {
      // useLogin hook will handle the redirect automatically
      await login(email, password);
      console.log('[LoginScreen] Login successful, redirect handled by hook');
    } catch (err) {
      console.error('[LoginScreen] Login failed:', err);
      // Error handled by hook
    }
  };

  const getRoleIcon = () => {
    switch (selectedRole) {
      case 'doctor':
        return <Stethoscope size={32} />;
      case 'hospital':
        return <Building2 size={32} />;
      default:
        return <User size={32} />;
    }
  };

  return (
    // ... rest of your JSX remains the same
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f5f7fa' }}>
      <div style={{ display: 'flex', maxWidth: '1200px', width: '100%', background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        {/* Left Side */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '48px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="11" fill="url(#logoGrad)" />
                <path d="M18 8v20M8 18h20" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>MediTrack</h1>
            <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>Smart Healthcare Platform</p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Why choose MediTrack?</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Book appointments with top doctors</li>
              <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Access medical records anytime</li>
              <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ AI-powered symptom checker</li>
              <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Secure and confidential</li>
            </ul>
          </div>

          <div style={{ marginTop: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '40px', fontSize: '13px' }}>
              <Sparkles size={14} />
              <span>Trusted by 10,000+ patients</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ flex: 1, padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}>
                {getRoleIcon()}
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>{getRoleTitle(selectedRole)}</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{getRoleDescription(selectedRole)}</p>
            </div>

            <LoginForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />

            <div style={{ textAlign: 'center', margin: '24px 0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e5e7eb' }}></div>
              <span style={{ background: 'white', padding: '0 12px', position: 'relative', color: '#9ca3af', fontSize: '12px' }}>or</span>
            </div>

            <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
              <p>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Create an account</Link>
              </p>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                <strong>Demo Credentials:</strong><br />
                Email: patient@example.com<br />
                Password: Patient@123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}