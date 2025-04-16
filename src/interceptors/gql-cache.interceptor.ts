import { ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of, tap } from 'rxjs';
import { createHash } from 'crypto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class GqlCacheInterceptor extends CacheInterceptor {
  cacheManager: any;

  trackBy(context: ExecutionContext): string | undefined {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const args = gqlContext.getArgs();

    const hash = createHash('md5').update(JSON.stringify(args)).digest('hex');
    return `graphql:${info.parentType.name}:${info.fieldName}:${hash}`;
  }

  getRequestResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    return { req: ctx.req ?? {}, res: ctx.res ?? {} };
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    if (!key) return next.handle();

    const { req } = this.getRequestResponse(context);
    const ttl = req.ttl ?? 60;

    const cached = await this.cacheManager.get(key);
    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      tap((response) => {
        this.cacheManager.set(key, response, ttl);
      }),
    );
  }
}
