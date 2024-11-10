import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { EventService } from "./event.service";

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() eventData: any) {
    return this.eventService.createEvent(eventData);
  }

  @Get()
  async getEvents() {
    return this.eventService.getEvents();
  }

  @Get(":id")
  async getEvent(@Param("id") id: string) {
    return this.eventService.getEvent(Number(id));
  }

  @Put(":id")
  async updateEvent(@Param("id") id: string, @Body() eventData: any) {
    return this.eventService.updateEvent(Number(id), eventData);
  }

  @Delete(":id")
  async deleteEvent(@Param("id") id: string) {
    return this.eventService.deleteEvent(Number(id));
  }
}
