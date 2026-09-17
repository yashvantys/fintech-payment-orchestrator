import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
    Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    constructor(@Inject('REDIS') private readonly redis: any) { } 

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const key = request.headers['idempotency-key'] as string;

        if (!key) {
            throw new BadRequestException('Idempotency-Key header is required');
        }

        const cached = await this.redis.get(`idemp:${key}`);
        if (cached) {
            const request = context.switchToHttp().getResponse();
            request.setHeader('X-Idempotent-Replayed', 'true');
            return of(JSON.parse(cached));
        }

        return next.handle().pipe(
            tap(async (response) => {
                await this.redis.setex(`idemp:${key}`, 86400, JSON.stringify(response));
            }),
        );
    }
}