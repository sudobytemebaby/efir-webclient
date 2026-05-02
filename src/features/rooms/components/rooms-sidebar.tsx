import { Link, useMatchRoute } from "@tanstack/react-router";
import { Plus, MessageSquare } from "lucide-react";

import { useMyRooms } from "../rooms.queries";
import { CreateRoomDialog } from "./create-room-dialog";
import { UserMenu } from "./user-menu";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "@/shared/ui/sidebar";

export function RoomsSidebar() {
  const { data, isLoading } = useMyRooms();
  const matchRoute = useMatchRoute();
  const rooms = Array.isArray(data) ? data : [];

  return (
    <Sidebar collapsible="icon" side="left">
      {/* Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/rooms" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <MessageSquare className="size-4!" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Efir</span>
                <span className="truncate text-xs">Мессенджер</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Room list */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Мои комнаты</SidebarGroupLabel>
          <CreateRoomDialog>
            <SidebarGroupAction title="Создать комнату">
              <Plus />
              <span className="sr-only">Создать комнату</span>
            </SidebarGroupAction>
          </CreateRoomDialog>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              {!isLoading && rooms.length === 0 && (
                <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                  <span className="px-3 py-2 text-sm text-muted-foreground">
                    Нет комнат
                  </span>
                </SidebarMenuItem>
              )}
              {rooms.map((room) => (
                <SidebarMenuItem key={room.room_id}>
                  <SidebarMenuButton
                    tooltip={room.name}
                    isActive={
                      !!matchRoute({
                        to: "/rooms/$roomId",
                        params: { roomId: room.room_id },
                      })
                    }
                    render={
                      <Link
                        to="/rooms/$roomId"
                        params={{ roomId: room.room_id }}
                      />
                    }
                  >
                    <Avatar className="size-5 shrink-0 rounded-md text-[10px]">
                      <AvatarFallback className="rounded-md bg-primary/10 text-foreground">
                        {room.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{room.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User */}
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
