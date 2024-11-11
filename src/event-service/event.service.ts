import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../shared/database.service";
import { RedisService } from "../shared/redis.service";
import { Knex } from "knex";

@Injectable()
export class EventService {
  knex: Knex;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {
    this.knex = this.databaseService.getKnex();
  }

  async createEvent(eventData: any): Promise<any> {
    const [createdEvent] = await this.knex("events")
      .insert(eventData)
      .returning("*");
    await this.redisService.publish(
      "event_updates",
      JSON.stringify(createdEvent),
    );
    return createdEvent;
  }

  async getEvents(): Promise<any[]> {
    return this.knex("events").select("*");
  }

  async getEvent(id: number): Promise<any> {
    return this.knex("events").where({ id }).first();
  }

  async updateEvent(id: number, eventData: any): Promise<any> {
    const [updatedEvent] = await this.knex("events")
      .where({ id })
      .update(eventData)
      .returning("*");
    await this.redisService.publish(
      "event_updates",
      JSON.stringify(updatedEvent),
    );
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await this.knex("events").where({ id }).del();
    await this.redisService.publish(
      "event_updates",
      JSON.stringify({ id, deleted: true }),
    );
  }
}
