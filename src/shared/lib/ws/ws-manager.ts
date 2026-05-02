import { env } from "@/shared/config/env";
import { apiClient } from "@/shared/api/client";

export interface Envelope {
  type: string;
  payload: unknown;
}

type EventHandler = (envelope: Envelope) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private handlers: Set<EventHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 1000;
  private readonly maxReconnectDelay = 30000;
  private shouldReconnect = false;
  private currentRoomId: string | null = null;

  async connect(roomId?: string): Promise<void> {
    this.shouldReconnect = true;
    this.currentRoomId = roomId ?? null;
    await this.doConnect();
  }

  private async doConnect(): Promise<void> {
    try {
      const { ticket } = await apiClient<{ ticket: string }>(
        "/auth/ws-ticket",
        { method: "POST" },
      );

      const url = new URL(`${env.wsUrl}/ws`);
      url.searchParams.set("ticket", ticket);
      if (this.currentRoomId) {
        url.searchParams.set("room_id", this.currentRoomId);
      }

      this.ws = new WebSocket(url.toString());

      this.ws.onopen = () => {
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data as string) as Envelope;
          this.handlers.forEach((handler) => handler(envelope));
        } catch {
          console.error("failed to parse ws message", event.data);
        }
      };

      this.ws.onclose = (event) => {
        if (this.shouldReconnect && event.code !== 1000) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      if (this.shouldReconnect) {
        this.scheduleReconnect();
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        this.maxReconnectDelay,
      );
      await this.doConnect();
    }, this.reconnectDelay);
  }

  subscribe(roomId: string): void {
    this.send({ type: "subscribe", payload: { room_id: roomId } });
  }

  unsubscribe(roomId: string): void {
    this.send({ type: "unsubscribe", payload: { room_id: roomId } });
  }

  private send(envelope: Envelope): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(envelope));
    }
  }

  onEvent(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close(1000, "disconnect");
    this.ws = null;
  }
}

export const wsManager = new WebSocketManager();
