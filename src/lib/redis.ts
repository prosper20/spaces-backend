import redis from "redis";

const redisClient = redis.createClient(process.env.REDIS_URL || '');

redisClient.on("connect", () => {
  console.log(`[Redis]: Connected to redis server 🚀`);
});

redisClient.on("error", (err) => {
  console.error(
    `[Redis]: Error connecting to Redis at: ${process.env.REDIS_URL || ''}\nError message: ${err.message}`,
  );
});

export { redisClient };