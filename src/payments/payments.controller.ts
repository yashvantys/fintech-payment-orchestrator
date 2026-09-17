import { Controller, Post, Body, Headers, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity.js';
import { IdempotencyInterceptor } from './idempotency.interceptor.js';

@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController {
    constructor(
        @InjectRepository(Payment)
        private readonly repo: Repository<Payment>,
    ) { }

    @Post()
    async create(
        @Headers('idempotency-key') key: string,
        @Body() body: { amount: number; currency: string },
    ) {
        console.log('Received body:', body, 'key:', key);

        const payment = this.repo.create({
            amount: body.amount,
            currency: body.currency,
            status: 'PENDING',
            idempotencyKey: key,
        });

        const saved = await this.repo.save(payment);
        return { id: saved.id, status: saved.status, amount: saved.amount, currency: saved.currency };
    }
}