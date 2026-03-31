import { useState } from 'react';
import { X, Mail, Lock, Sparkles, Stethoscope, Building2, User } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { AuthHeader } from './AuthHeader';
import { AuthFormWrapper } from './AuthFormWrapper';
import { AuthDivider } from './AuthDivider';
import { AuthMessage } from './AuthMessage';
import { useLogin } from '../../../hooks/auth/useLogin';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'patient' | 'doctor' | 'hospital';
}

const ROLE_OPTIONS = [
  { id: 'patient', label: 'Patient', icon: User, description: 'Book appointments, view records' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, description: 'Manage patients, write prescriptions' },
  { id: 'hospital', label: 'Hospital Admin', icon: Building2, description: 'Manage hospital operations' },
] as const;

export function LoginModal({ isOpen, onClose, defaultRole = 'patient' }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'hospital'>(defaultRole);
  const { login, isLoading, error } = useLogin();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setPassword('');
  };

  const getRoleIcon = () => {
    switch (selectedRole) {
      case 'doctor': return <Stethoscope size={24} />;
      case 'hospital': return <Building2 size={24} />;
      default: return <User size={24} />;
    }
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'doctor': return 'Doctor Sign In';
      case 'hospital': return 'Hospital Admin Sign In';
      default: return 'Patient Sign In';
    }
  };

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal__close" onClick={handleClose} aria-label="Close">
          <X size={20} />
        </button>

        <AuthHeader
          title={getRoleTitle()}
          subtitle="Access your MediTrack account"
          icon={
            <div className="login-modal__role-icon">
              {getRoleIcon()}
            </div>
          }
        />

        {/* Role Selector */}
        <div className="login-modal__role-selector">
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role.id)}
              className={`role-option ${selectedRole === role.id ? 'role-option--active' : ''}`}
            >
              <role.icon size={18} />
              <span>{role.label}</span>
            </button>
          ))}
        </div>

        {error && (
          <AuthMessage type="error" message={error} />
        )}

        <AuthFormWrapper onSubmit={handleSubmit} isLoading={isLoading}>
          <div className="auth-field">
            <label className="auth-field__label">
              <Mail size={16} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="auth-field__input"
            />
          </div>

          <div className="auth-field">
            <label className="auth-field__label">
              <Lock size={16} />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="auth-field__input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-submit"
          >
            {isLoading ? (
              <span className="auth-submit__spinner" />
            ) : (
              <>
                <Sparkles size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </AuthFormWrapper>

        <AuthDivider />

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <a href="/signup" onClick={handleClose} className="auth-footer__link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}