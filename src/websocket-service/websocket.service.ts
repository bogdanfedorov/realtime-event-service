import { Injectable, OnModuleInit } from "@nestjs/common";
import { Server } from "socket.io";
import { RedisService } from "../shared/redis.service";

@Injectable()
export class WebsocketService implements OnModuleInit {
  private server: Server;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.subscribeToEventUpdates();
  }

  setServer(server: Server) {
    this.server = server;
  }

  emitToAll(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    }
  }

  private subscribeToEventUpdates() {
    this.redisService.subscribe("event_updates", (message) => {
      const eventUpdate = JSON.parse(message);
      this.emitToAll("eventUpdate", eventUpdate);
    });
  }
}
