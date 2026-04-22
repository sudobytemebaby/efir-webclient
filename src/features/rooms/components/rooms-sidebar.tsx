import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Plus, Settings, LogOut, User } from "lucide-react";

import { useMyRooms, useCreateRoom } from "../rooms.queries";
import { useLogout } from "@/features/auth/auth.queries";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field, FieldGroup, FieldError } from "@/shared/ui/field";
import { cn } from "@/shared/lib/utils";
import type { RoomType } from "../rooms.types";

export function RoomsSidebar() {
  const { state, isMobile } = useSidebar();
  const { data, isLoading } = useMyRooms();
  const rooms = Array.isArray(data) ? data : [];
  const routerState = useRouterState();
  const activeRoomId = routerState.location.pathname.split("/").pop();
  const logout = useLogout();
  const createRoom = useCreateRoom();
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roomName, setRoomName] = useState("");

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    try {
      await createRoom.mutateAsync({
        name: roomName.trim(),
        type: "ROOM_TYPE_GROUP" as RoomType,
      });
      setRoomName("");
      setCreateRoomOpen(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setRoomName("");
    }
    setCreateRoomOpen(open);
  };

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog open={createRoomOpen} onOpenChange={handleOpenChange}>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start w-full",
                  state === "collapsed" && "justify-center w-8 p-0",
                )}
                onClick={() => setCreateRoomOpen(true)}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Plus className="size-4" />
                </div>
                {state !== "collapsed" && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Комнаты</span>
                    <span className="truncate text-xs">Создать новую</span>
                  </div>
                )}
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать комнату</DialogTitle>
                  <DialogDescription>
                    Создайте новую комнату для общения с участниками
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateRoom}>
                  <FieldGroup>
                    <Field>
                      <Input
                        placeholder="Название комнаты"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        autoFocus
                      />
                      <FieldError>Название обязательно</FieldError>
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateRoomOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      disabled={!roomName.trim() || createRoom.isPending}
                    >
                      {createRoom.isPending ? "Создание..." : "Создать"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Мои комнаты</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && (
                <SidebarMenuItem>
                  <span className="px-3 py-2 text-sm text-muted-foreground">
                    Загрузка...
                  </span>
                </SidebarMenuItem>
              )}
              {!isLoading && rooms.length === 0 && (
                <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                  <span className="px-3 py-2 text-sm text-muted-foreground">
                    Нет комнат
                  </span>
                </SidebarMenuItem>
              )}
              {rooms.map((room) => (
                <SidebarMenuItem key={room.room_id}>
                  <SidebarMenuButton isActive={activeRoomId === room.room_id}>
                    <Link
                      to="/rooms/$roomId"
                      params={{ roomId: room.room_id }}
                      className="flex items-center gap-2 w-full"
                    >
                      <RoomIcon name={room.name} />
                      <span className="truncate">{room.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start w-full",
                  state === "collapsed" && "justify-center w-8 p-0",
                )}
                onClick={() => setUserMenuOpen(true)}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">U</AvatarFallback>
                </Avatar>
                {state !== "collapsed" && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Username</span>
                    <span className="truncate text-xs">user@example.com</span>
                  </div>
                )}
              </Button>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Username</span>
                        <span className="truncate text-xs">
                          user@example.com
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="size-4 mr-2" />
                    Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="size-4 mr-2" />
                    Настройки
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout.mutate()}>
                  <LogOut className="size-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function RoomIcon({ name }: { name: string }) {
  return (
    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium shrink-0">
      {name[0]?.toUpperCase()}
    </div>
  );
}
