import { Test, TestingModule } from "@nestjs/testing";
import { WebsocketService } from "./websocket.service";
import { RedisService } from "../shared/redis.service";
import { Server } from "socket.io";

describe("WebsocketService", () => {
  let service: WebsocketService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketService,
        {
          provide: RedisService,
          useValue: {
            subscribe: jest.fn((channel, callback) => {
              callback('{"id": 1, "name": "Test Event"}');
            }),
          },
        },
      ],
    }).compile();

    service = module.get<WebsocketService>(WebsocketService);
    redisService = module.get<RedisService>(RedisService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("setServer", () => {
    it("should set the server", () => {
      const mockServer = { emit: jest.fn() } as unknown as Server;
      service.setServer(mockServer);
      expect(service["server"]).toBe(mockServer);
    });
  });

  describe("emitToAll", () => {
    it("should emit to all clients", () => {
      const mockServer = { emit: jest.fn() } as unknown as Server;
      service.setServer(mockServer);
      service.emitToAll("testEvent", { data: "test" });
      expect(mockServer.emit).toHaveBeenCalledWith("testEvent", {
        data: "test",
      });
    });
  });
});
