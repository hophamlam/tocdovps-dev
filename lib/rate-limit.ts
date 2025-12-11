import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting configuration cho API benchmark report
 * 
 * Sử dụng Upstash Redis để track requests per IP
 * Free tier: 10,000 commands/day (đủ cho ~10,000 requests/day)
 * 
 * Rate limit: 10 requests/phút/IP
 * - Normal users: Đủ dùng (benchmark chạy ~15 phút, chỉ gửi 1 request)
 * - Attackers: Bị block sau 10 requests/phút
 */

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create rate limiter
// 10 requests per 60 seconds (1 minute) per IP
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per 60 seconds
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@tocdovps/ratelimit",
});

/**
 * Check rate limit cho một IP address
 * @param identifier - IP address hoặc identifier khác
 * @returns Object với { success: boolean, limit: number, remaining: number, reset: number }
 */
export async function checkRateLimit(identifier: string) {
  try {
    // Nếu không có Redis config, skip rate limiting (development)
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn("[RateLimit] Redis not configured, skipping rate limit check");
      return {
        success: true,
        limit: 10,
        remaining: 10,
        reset: Date.now() + 60000,
      };
    }

    const result = await rateLimiter.limit(identifier);
    return result;
  } catch (error) {
    // Nếu Redis error, log và allow request (fail open)
    console.error("[RateLimit] Error checking rate limit:", error);
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 60000,
    };
  }
}

