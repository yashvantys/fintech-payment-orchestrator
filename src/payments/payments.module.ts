import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity.js';
import { PaymentsController } from './payments.controller.js';
import { SqsService } from './sqs.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [SqsService],
})
export class PaymentsModule {}