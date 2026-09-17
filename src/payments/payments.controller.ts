import { Controller, Post, Body, Headers, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity.js';
import { IdempotencyInterceptor } from './idempotency.interceptor.js';
import { SqsService } from './sqs.service.js';

@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController {
    constructor(
        @InjectRepository(Payment)
        private readonly repo: Repository<Payment>,
        private readonly sqsService: SqsService,
    ) { }

    @Post()
    async create(
        @Headers('idempotency-key') key: string,
        @Body() body: { amount: number; currency: string },
    ) {
        const payment = this.repo.create({
            amount: body.amount,
            currency: body.currency,
            status: 'PENDING',
            idempotencyKey: key,
        });

        const saved = await this.repo.save(payment);

        // Async processing - API returns fast
        await this.sqsService.sendPayment({
            id: saved.id,
            amount: saved.amount,
            currency: saved.currency,
            idempotencyKey: saved.idempotencyKey,
        });

        return {
            id: saved.id,
            status: saved.status,
            amount: saved.amount,
            currency: saved.currency,
            message: 'Payment queued for processing'
        };
    }
}