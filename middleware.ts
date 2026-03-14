import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { routes } from "./utils/constants";

const privateRoutes = Object.values(routes.protectedRoutes).map(route => `${route}(.*)`);
const isPrivateRoute = createRouteMatcher(privateRoutes);

export default convexAuthNextjsMiddleware(async request => {
  if (isPrivateRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
