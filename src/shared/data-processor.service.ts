import { Injectable } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { WebsocketService } from "../websocket-service/websocket.service";

@Injectable()
export class DataProcessorService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly websocketService: WebsocketService,
  ) {}

  async processRecentEvents() {
    const knex = this.databaseService.getKnex();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentEvents = await knex("events")
      .where("start_time", ">=", fiveMinutesAgo)
      .orderBy("start_time", "desc");

    const groupedEvents = this.groupEventsByHour(recentEvents);

    this.websocketService.emitToAll("recentEvents", groupedEvents);
  }

  private groupEventsByHour(events: any[]) {
    return events.reduce((acc, event) => {
      const hour = new Date(event.start_time).getHours();
      if (!acc[hour]) {
        acc[hour] = [];
      }
      acc[hour].push(event);
      return acc;
    }, {});
  }

  startPeriodicProcessing() {
    setInterval(() => this.processRecentEvents(), 5 * 60 * 1000); // Run every 5 minutes
  }
}
