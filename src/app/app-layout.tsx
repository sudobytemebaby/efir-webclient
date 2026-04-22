import { Outlet } from "@tanstack/react-router";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/shared/ui/sidebar";
import { RoomsSidebar } from "@/features/rooms/components/rooms-sidebar";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <RoomsSidebar />
      <SidebarInset>
        <div className="p-4 md:hidden">
          <SidebarTrigger />
        </div>
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}