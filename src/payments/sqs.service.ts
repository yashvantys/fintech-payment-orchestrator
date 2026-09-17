import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private sqs = new SQSClient({ endpoint: 'http://localhost:4566', region: 'us-east-1' });

  async sendPaymentJob(paymentId: string) {
    await this.sqs.send(new SendMessageCommand({
      QueueUrl: 'http://localhost:4566/000000000000/payment-queue',
      MessageBody: JSON.stringify({ paymentId }),
      MessageGroupId: paymentId // For FIFO
    }));
  }
}