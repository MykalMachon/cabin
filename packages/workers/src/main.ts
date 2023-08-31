import * as dotenv from 'dotenv'

import { Worker, Queue } from 'bullmq';
import { emailQueueProcessor } from './queues/email';


// ! Defaults and setup 
// load .env file
dotenv.config();

// default redis connection
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
}

// ! Scheduled queues 
// ? these are queues that run on a schedule, like every 5 minutes, every hour, etc.
// ? they are part of the workers package and are not typically triggered by the webapp.
// ? see here for docs: https://docs.bullmq.io/guide/jobs/repeatable

// TODO: create a queue for cleaning up password reset tokens that are expired

// TODO: create a queue for sending out daily notification emails to users who have notifications that are unread.

// ! On Demand Workers & Tasks 
// ? These are queues that are triggered as needed by the webapp for long-running background tasks 
// ? like sending an email, processing a large operation, etc. 
export const emailWorker = new Worker('email',
  emailQueueProcessor,
  { connection: redisConnection, concurrency: 2 }
);

