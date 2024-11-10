import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../shared/database.service";
import { RedisService } from "../shared/redis.service";

@Injectable()
export class EventService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  async createEvent(eventData: any): Promise<any> {
    const knex = this.databaseService.getKnex();
    const [createdEvent] = await knex("events")
      .insert(eventData)
      .returning("*");
    await this.redisService.publish(
      "event_updates",
      JSON.stringify(createdEvent),
    );
    return createdEvent;
  }

  async getEvents(): Promise<any[]> {
    const knex = this.databaseService.getKnex();
    return knex("events").select("*");
  }

  async getEvent(id: number): Promise<any> {
    const knex = this.databaseService.getKnex();
    return knex("events").where({ id }).first();
  }

  async updateEvent(id: number, eventData: any): Promise<any> {
    const knex = this.databaseService.getKnex();
    const [updatedEvent] = await knex("events")
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
    const knex = this.databaseService.getKnex();
    await knex("events").where({ id }).del();
    await this.redisService.publish(
      "event_updates",
      JSON.stringify({ id, deleted: true }),
    );
  }
}
