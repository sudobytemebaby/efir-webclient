import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { roomsApi } from "./rooms.api";

export const roomsQueries = {
  myRooms: () =>
    queryOptions({
      queryKey: ["rooms"],
      queryFn: () => roomsApi.getMyRooms(),
    }),

  room: (roomId: string) =>
    queryOptions({
      queryKey: ["rooms", roomId],
      queryFn: () => roomsApi.getRoom(roomId),
      enabled: !!roomId,
    }),
};

export function useMyRooms() {
  return useQuery(roomsQueries.myRooms());
}

export function useRoom(roomId: string) {
  return useQuery(roomsQueries.room(roomId));
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomsApi.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomsApi.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
