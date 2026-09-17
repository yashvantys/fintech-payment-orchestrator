import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async () => {
        const { Redis } = await import('ioredis');
        return new Redis({
          host: 'localhost',
          port: 6379,
          maxRetriesPerRequest: 3,
        });
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}