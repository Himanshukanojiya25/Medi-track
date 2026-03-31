import { Sparkles } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AuthHeader({ title, subtitle, icon }: AuthHeaderProps) {
  return (
    <div className="auth-header">
      {icon && (
        <div className="auth-header__icon">
          {icon}
        </div>
      )}
      <h1 className="auth-header__title">{title}</h1>
      {subtitle && (
        <p className="auth-header__subtitle">{subtitle}</p>
      )}
    </div>
  );
}