import { useParams } from "@tanstack/react-router";
import { useRoom } from "../rooms.queries";

export function RoomDetailPage() {
  const { roomId } = useParams({ from: "/protected/rooms/$roomId" });
  const { data, isLoading } = useRoom(roomId);

  if (isLoading) return <div className="p-4">Загрузка...</div>;
  if (!data) return <div className="p-4">Комната не найдена</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-3">
        <h1 className="font-semibold">{data.room.name}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-muted-foreground text-sm">
          Сообщения появятся здесь
        </p>
      </div>
    </div>
  );
}
