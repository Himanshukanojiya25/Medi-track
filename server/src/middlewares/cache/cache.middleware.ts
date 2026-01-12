import { Request, Response, NextFunction } from "express";
import { CacheService } from "../../cache/cache.service";

export const cacheGet =
  (ttlSeconds: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const key = `http:${req.originalUrl}`;

    const cached = await CacheService.get(key);
    if (cached) {
      console.log("⚡ HTTP CACHE HIT:", key);
      return res.json(cached);
    }

    console.log("🐢 HTTP CACHE MISS:", key);

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      CacheService.set(key, body, ttlSeconds).catch(() => {});
      return originalJson(body);
    };

    next();
  };
