import { Test, TestingModule } from "@nestjs/testing";
import { EventService } from "./event.service";
import { DatabaseService } from "../shared/database.service";
import { RedisService } from "../shared/redis.service";

describe("EventService", () => {
  let service: EventService;
  let databaseService: DatabaseService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: DatabaseService,
          useValue: {
            getKnex: jest.fn().mockReturnValue({
              insert: jest.fn().mockReturnThis(),
              returning: jest
                .fn()
                .mockResolvedValue([{ id: 1, name: "Test Event" }]),
              select: jest
                .fn()
                .mockResolvedValue([{ id: 1, name: "Test Event" }]),
              where: jest.fn().mockReturnThis(),
              first: jest.fn().mockResolvedValue({ id: 1, name: "Test Event" }),
              update: jest.fn().mockReturnThis(),
              del: jest.fn().mockResolvedValue(1),
            }),
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
    databaseService = module.get<DatabaseService>(DatabaseService);
    redisService = module.get<RedisService>(RedisService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createEvent", () => {
    it("should create an event and publish to Redis", async () => {
      const eventData = { name: "Test Event" };
      const result = await service.createEvent(eventData);
      expect(result).toEqual({ id: 1, name: "Test Event" });
      expect(redisService.publish).toHaveBeenCalledWith(
        "event_updates",
        JSON.stringify({ id: 1, name: "Test Event" }),
      );
    });
  });

  describe("getEvents", () => {
    it("should return all events", async () => {
      const result = await service.getEvents();
      expect(result).toEqual([{ id: 1, name: "Test Event" }]);
    });
  });

  describe("getEvent", () => {
    it("should return a single event", async () => {
      const result = await service.getEvent(1);
      expect(result).toEqual({ id: 1, name: "Test Event" });
    });
  });

  describe("updateEvent", () => {
    it("should update an event and publish to Redis", async () => {
      const eventData = { name: "Updated Event" };
      const result = await service.updateEvent(1, eventData);
      expect(result).toEqual({ id: 1, name: "Test Event" });
      expect(redisService.publish).toHaveBeenCalledWith(
        "event_updates",
        JSON.stringify({ id: 1, name: "Test Event" }),
      );
    });
  });

  describe("deleteEvent", () => {
    it("should delete an event and publish to Redis", async () => {
      await service.deleteEvent(1);
      expect(redisService.publish).toHaveBeenCalledWith(
        "event_updates",
        JSON.stringify({ id: 1, deleted: true }),
      );
    });
  });
});
