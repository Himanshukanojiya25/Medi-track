import { Sparkles } from 'lucide-react';

interface LoginFormActionsProps {
  isLoading: boolean;
  onSubmit: () => void;
}

export function LoginFormActions({ isLoading, onSubmit }: LoginFormActionsProps) {
  return (
    <div className="login-form-actions">
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="login-form-actions__btn login-form-actions__btn--primary"
      >
        {isLoading ? (
          <span className="login-form-actions__spinner" />
        ) : (
          <>
            <Sparkles size={16} />
            <span>Sign In</span>
          </>
        )}
      </button>
    </div>
  );
}