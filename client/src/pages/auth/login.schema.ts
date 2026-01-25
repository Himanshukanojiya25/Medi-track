export type LoginPayload = {
  email: string;
  password: string;
};

export const validateLogin = (payload: LoginPayload) => {
  if (!payload.email || !payload.password) {
    return 'Email and password are required';
  }
  if (!payload.email.includes('@')) {
    return 'Invalid email address';
  }
  if (payload.password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};
