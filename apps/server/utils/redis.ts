import * as dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

interface CacheArguments<T> {
  key: string;
  request: () => Promise<T>;
  ttl?: number; // default 3600
}

export type CachedRequest = <T>(args: CacheArguments<T>) => Promise<T | null>;

export interface CacheContext {
  get: CachedRequest;
  delete: (key: string) => Promise<number>;
}

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

export const cache: CacheContext = {
  get: ({ key, request, ttl = 3600 }) => {
    return new Promise((resolve, reject) => {
      redis.get(key, async (err, response) => {
        if (err) reject(err);

        if (response) {
          // If a item is found in the redis cache resolve
          resolve(await JSON.parse(response));
        } else {
          // No item found, get the data from postgres
          const data = await request();
          // Set the item in redis
          redis.setex(key, ttl, JSON.stringify(data));
          resolve(data);
        }

        resolve(null);
      });
    });
  },
  delete: (key: string) => {
    return redis.del(key);
  },
};
