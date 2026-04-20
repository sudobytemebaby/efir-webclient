import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { queryClient } from "@/app/query-client";

import { RootLayout } from "@/app/root-layout";
import { LoginPage } from "@/features/auth/pages/login.page";
import { RegisterPage } from "@/features/auth/pages/register.page";
import { RoomsPage } from "@/features/rooms/pages/rooms.page";

const rootRoute = createRootRoute({
  component: RootLayout,
});

// Public Route
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("not authenticated");
          return res.json();
        },
        staleTime: Infinity,
      });
      // already loged in — redirect
      throw redirect({ to: "/rooms" });
    } catch (e) {
      // if it's redirect — hooks
      if (e instanceof Error && "href" in (e as unknown as object)) throw e;
      // if not loged in — go to authorization page
    }
  },
});

// Protected route - redirects unlogged
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("not authenticated");
          return res.json();
        },
        staleTime: Infinity,
      });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/register",
  component: RegisterPage,
});

const roomsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/rooms",
  component: RoomsPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/rooms" });
  },
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    authRoute.addChildren([loginRoute, registerRoute]),
    protectedRoute.addChildren([roomsRoute]),
  ]),
});

// Introducing type safety for useNavigate, Link and etc.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
