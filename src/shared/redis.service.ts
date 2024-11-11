import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: "localhost",
      port: 6380,
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.redisClient.publish(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    const subscriber = this.redisClient.duplicate();
    await subscriber.subscribe(channel);
    subscriber.on("message", (channel, message) => callback(message));
  }
}
