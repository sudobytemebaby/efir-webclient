import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { queryClient } from "./query-client";
import { RootLayout } from "./root-layout";
import { AppLayout } from "./app-layout";
import { LoginPage } from "@/features/auth/pages/login.page";
import { RegisterPage } from "@/features/auth/pages/register.page";
import { RoomsPage } from "@/features/rooms/pages/rooms.page";
import { RoomDetailPage } from "@/features/rooms/pages/room-detail";

const rootRoute = createRootRoute({ component: RootLayout });

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: () => <Outlet />,
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const res = await fetch(`/api/auth/me`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("not authenticated");
          return res.json();
        },
        staleTime: Infinity,
      });
      throw redirect({ to: "/rooms" });
    } catch (e) {
      if (e && typeof e === "object" && "href" in e) throw e;
    }
  },
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: AppLayout,
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const res = await fetch(`/api/auth/me`, {
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

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/rooms" });
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

const roomDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/rooms/$roomId",
  component: RoomDetailPage,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    authRoute.addChildren([loginRoute, registerRoute]),
    protectedRoute.addChildren([roomsRoute, roomDetailRoute]),
  ]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
