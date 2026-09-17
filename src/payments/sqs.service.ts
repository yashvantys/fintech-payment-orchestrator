import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name);
  private redis: Redis;

  constructor() {
    // Use Redis as Queue (BullMQ pattern - DAZN uses same pattern)
    this.redis = new Redis({ host: 'localhost', port: 6379 });
  }

  async sendPayment(payment: any) {
    try {
      // Push to Redis List = SQS queue
      await this.redis.lpush('payments-queue', JSON.stringify(payment));
      this.logger.log(`✅ [REDIS QUEUE] Payment ${payment.id} queued - ₹${payment.amount}`);
      
      // For real AWS prod, just change this to SQS:
      // await sqs.send(new SendMessageCommand({...}))
      
      return { MessageId: `redis-${Date.now()}` };
    } catch (err) {
      this.logger.error('Queue error', err);
      return { MessageId: 'mock-fallback' };
    }
  }

  // Helper to see queue
  async getQueueLength() {
    return await this.redis.llen('payments-queue');
  }
}