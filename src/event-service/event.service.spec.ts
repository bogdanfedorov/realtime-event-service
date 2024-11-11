import { Test, TestingModule } from "@nestjs/testing";
import { EventService } from "./event.service";
import { DatabaseService } from "../shared/database.service";
import { RedisService } from "../shared/redis.service";
import { Knex } from "knex";

describe("EventService", () => {
  let service: EventService;
  let mockKnex: jest.Mocked<Knex>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    mockKnex = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      update: jest.fn().mockReturnThis(),
      del: jest.fn(),
      returning: jest.fn(),
      orderBy: jest.fn().mockReturnThis(),
      toSQL: jest.fn().mockReturnThis(),
      toNative: jest.fn(),
    } as unknown as jest.Mocked<Knex>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: DatabaseService,
          useValue: {
            getKnex: jest.fn().mockReturnValue(mockKnex),
          },
        },
        {
          provide: RedisService,
          useValue: {
            publish: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    redisService = module.get<RedisService>(
      RedisService,
    ) as jest.Mocked<RedisService>;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createEvent", () => {
    it("should create an event and publish to Redis", async () => {
      const eventData = { name: "Test Event" };
      const createdEvent = { id: 1, ...eventData };
      mockKnex.insert.mockReturnThis();
      mockKnex.returning.mockResolvedValue([createdEvent]);

      console.log("test", service.knex("events"));
      const result = await service.createEvent(eventData);

      expect(result).toEqual(createdEvent);
      expect(mockKnex.insert).toHaveBeenCalledWith(eventData);
      expect(mockKnex.returning).toHaveBeenCalledWith("*");
      expect(redisService.publish).toHaveBeenCalledWith(
        "event_updates",
        JSON.stringify(createdEvent),
      );
    });
  });

  describe("getEvents", () => {
    it("should return all events", async () => {
      const events = [
        { id: 1, name: "Event 1" },
        { id: 2, name: "Event 2" },
      ];
      mockKnex.select.mockResolvedValue(events);

      const result = await service.getEvents();

      expect(result).toEqual(events);
      expect(mockKnex.select).toHaveBeenCalledWith("*");
    });
  });

  describe("getEvent", () => {
    it("should return a single event", async () => {
      const event = { id: 1, name: "Test Event" };
      mockKnex.where.mockReturnThis();
      mockKnex.first.mockResolvedValue(event);

      const result = await service.getEvent(1);

      expect(result).toEqual(event);
      expect(mockKnex.where).toHaveBeenCalledWith({ id: 1 });
      expect(mockKnex.first).toHaveBeenCalled();
    });
  });

  describe("updateEvent", () => {
    it("should update an event and publish to Redis", async () => {
      const eventData = { name: "Updated Event" };
      const updatedEvent = { id: 1, ...eventData };
      mockKnex.where.mockReturnThis();
      mockKnex.update.mockReturnThis();
      mockKnex.returning.mockResolvedValue([updatedEvent]);

      const result = await service.updateEvent(1, eventData);

      expect(result).toEqual(updatedEvent);
      expect(mockKnex.where).toHaveBeenCalledWith({ id: 1 });
      expect(mockKnex.update).toHaveBeenCalledWith(eventData);
      expect(mockKnex.returning).toHaveBeenCalledWith("*");
      expect(redisService.publish).toHaveBeenCalledWith(
        "event_updates",
        JSON.stringify(updatedEvent),
      );
    });
  });

  describe("deleteEvent", () => {
    it("should delete an event and publish to Redis", async () => {
      mockKnex.where.mockReturnThis();
      mockKnex.del.mockResolvedValue(1);

      await service.deleteEvent(1);

      expect(mockKnex.where).toHaveBeenCalledWith({ id: 1 });
      expect(mockKnex.del).toHaveBeenCalled();
      expect(redisService.publish).toHaveBeenCalledWith(
        "event_updates",
        JSON.stringify({ id: 1, deleted: true }),
      );
    });
  });
});
