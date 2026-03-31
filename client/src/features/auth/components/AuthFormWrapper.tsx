import React from 'react';

interface AuthFormWrapperProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function AuthFormWrapper({ children, onSubmit, isLoading = false }: AuthFormWrapperProps) {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <fieldset disabled={isLoading} className="auth-form__fieldset">
        {children}
      </fieldset>
    </form>
  );
}