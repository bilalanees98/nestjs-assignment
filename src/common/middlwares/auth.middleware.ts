import {
  Injectable,
  HttpException,
  HttpStatus,
  NestMiddleware,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth/auth.service';

interface PayloadInterface {
  id: string;
  email: string;
  iat: number;
}

@Injectable()
export class AuthMiddleware<T> implements NestMiddleware {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    try {
      if (req.headers.authorization === undefined) {
        throw new HttpException(
          {
            message: 'Unauthorized request',
            status: HttpStatus.UNAUTHORIZED,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const authToken = req.headers.authorization;

      const payload: PayloadInterface = await this.authService.verifyToken(
        authToken.slice(7),
      );
      const exists = await this.userService.userExists(payload.id);
      if (exists) {
        const { iat, ...newPayload } = payload;
        req.user = newPayload;
        next();
      } else {
        throw new HttpException(
          {
            message: 'Unauthorized request',
            status: HttpStatus.UNAUTHORIZED,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          status: error.status ? error.status : HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async intercept(
  //   context: ExecutionContext,
  //   next: CallHandler,
  // ): Promise<Observable<any>> {
  //   const url = context.switchToHttp().getRequest().url;
  //   const excludedPaths = ['/login'];
  //   if (true) {
  //     try {
  //       const authToken = context.switchToHttp().getRequest()
  //         .headers.authorization;
  //       const payload: any = await this.authService.verifyToken(
  //         authToken.slice(7),
  //       );
  //       const exists = await this.userService.userExists(payload.id);
  //       if (exists) {
  //         return next.handle();
  //       } else {
  //         throw new HttpException(
  //           {
  //             message: 'Unauthorized request',
  //             status: HttpStatus.UNAUTHORIZED,
  //           },
  //           HttpStatus.UNAUTHORIZED,
  //         );
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       throw new HttpException(
  //         {
  //           message: error.message,
  //           status: HttpStatus.BAD_REQUEST,
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   } else {
  //     return next.handle();
  //   }
  // }
}
