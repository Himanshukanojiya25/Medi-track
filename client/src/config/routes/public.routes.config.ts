/**
 * Publicly accessible routes
 * No authentication required
 */
export const PUBLIC_ROUTES = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/login",
    label: "Login",
  },
  {
    path: "/signup",
    label: "Signup",
  },
  {
    path: "/contact",
    label: "Contact",
  },
] as const;
