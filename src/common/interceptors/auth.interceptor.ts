import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const authToken = context.switchToHttp().getRequest().headers.authorization;
    console.log('authToken: ', authToken);
    const now = Date.now();
    return next
      .handle()
      .pipe(map(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
