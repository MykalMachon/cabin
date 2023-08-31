import { Queue } from 'bullmq';

// default redis connection
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
}

// common queues
export const emailQueue = new Queue('email', { connection: redisConnection });