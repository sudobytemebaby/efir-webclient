export type RoomType =
  | "ROOM_TYPE_DIRECT"
  | "ROOM_TYPE_GROUP"
  | "ROOM_TYPE_UNSPECIFIED";

export interface Room {
  room_id: string;
  name: string;
  type: RoomType;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoomRequest {
  name: string;
  type: RoomType;
  participant_id?: string;
}
