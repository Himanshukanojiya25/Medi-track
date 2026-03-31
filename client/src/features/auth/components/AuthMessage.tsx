import { AlertCircle, CheckCircle } from 'lucide-react';

interface AuthMessageProps {
  type: 'error' | 'success';
  message: string;
  onClose?: () => void;
}

export function AuthMessage({ type, message, onClose }: AuthMessageProps) {
  const Icon = type === 'error' ? AlertCircle : CheckCircle;
  const className = `auth-message auth-message--${type}`;

  return (
    <div className={className}>
      <Icon size={16} className="auth-message__icon" />
      <span className="auth-message__text">{message}</span>
      {onClose && (
        <button onClick={onClose} className="auth-message__close" aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}