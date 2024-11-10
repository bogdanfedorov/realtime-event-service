import { Module } from "@nestjs/common";
import { EventService } from "./event-service/event.service";
import { EventController } from "./event-service/event.controller";
import { WebsocketGateway } from "./websocket-service/websocket.gateway";
import { WebsocketService } from "./websocket-service/websocket.service";
import { RedisService } from "./shared/redis.service";
import { DatabaseService } from "./shared/database.service";
import { DataProcessorService } from "./shared/data-processor.service";

@Module({
  imports: [],
  controllers: [EventController],
  providers: [
    EventService,
    WebsocketGateway,
    WebsocketService,
    RedisService,
    DatabaseService,
    DataProcessorService,
  ],
})
export class AppModule {}
