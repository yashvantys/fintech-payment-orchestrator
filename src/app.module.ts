import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payments/payment.entity.js';
import { PaymentsModule } from './payments/payments.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'payments',
      entities: [Payment],
      synchronize: true,
    }),
    PaymentsModule,
  ],
})
export class AppModule { }