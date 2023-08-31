import type { Job, Processor } from "bullmq";

export const emailQueueProcessor: Processor = async (job: Job) => {
  console.log('sending email...')
  console.log(job.data)
};