import { apiClient } from "@/shared/api/client";
import type { Room, CreateRoomRequest } from "./rooms.types";

export const roomsApi = {
  getMyRooms: () => apiClient<Room[]>("/rooms"),

  getRoom: (roomId: string) => apiClient<{ room: Room }>(`/rooms/${roomId}`),

  createRoom: (data: CreateRoomRequest) =>
    apiClient<{ room: Room }>("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteRoom: (roomId: string) =>
    apiClient<null>(`/rooms/${roomId}`, { method: "DELETE" }),

  addMember: (roomId: string, userId: string) =>
    apiClient<null>(`/rooms/${roomId}/members`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),

  removeMember: (roomId: string, userId: string) =>
    apiClient<null>(`/rooms/${roomId}/members/${userId}`, {
      method: "DELETE",
    }),
};
