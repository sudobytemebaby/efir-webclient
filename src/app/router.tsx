import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  isRedirect,
  Outlet,
} from "@tanstack/react-router";
import { queryClient } from "./query-client";
import { RootLayout } from "./root-layout";
import { AppLayout } from "./app-layout";
import { LoginPage } from "@/features/auth/pages/login.page";
import { RegisterPage } from "@/features/auth/pages/register.page";
import { RoomsPage } from "@/features/rooms/pages/rooms.page";
import { RoomDetailPage } from "@/features/rooms/pages/room-detail";
import { authQueries } from "@/features/auth/auth.queries";

const rootRoute = createRootRoute({ component: RootLayout });

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: () => <Outlet />,
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery(authQueries.me());
      throw redirect({ to: "/rooms" });
    } catch (e) {
      if (isRedirect(e)) throw e;
    }
  },
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: AppLayout,
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery(authQueries.me());
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
