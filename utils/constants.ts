/**
 * Application route constants.
 * Add protected routes here — middleware will enforce authentication automatically.
 */
export const routes = {
  publicRoutes: {
    home: "/",
    signup: "/signup",
    login: "/login",
  },
  protectedRoutes: {
    dashboard: "/dashboard",
    settings: "/settings",
    admin: "/admin",
  },
} as const;

/**
 * Default redirect paths after auth events.
 */
export const redirects = {
  afterSignIn: "/dashboard",
  afterSignOut: "/",
} as const;
