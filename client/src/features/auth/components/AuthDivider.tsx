interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = 'or' }: AuthDividerProps) {
  return (
    <div className="auth-divider">
      <span className="auth-divider__line" />
      <span className="auth-divider__text">{text}</span>
      <span className="auth-divider__line" />
    </div>
  );
}