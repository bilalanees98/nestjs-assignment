import { HttpException, HttpStatus } from '@nestjs/common';

export const http400 = (message: string) => {
  throw new HttpException(
    {
      message,
      status: HttpStatus.BAD_REQUEST,
    },
    HttpStatus.BAD_REQUEST,
  );
};

export const http401 = (message: string) => {
  throw new HttpException(
    {
      message,
      status: HttpStatus.UNAUTHORIZED,
    },
    HttpStatus.UNAUTHORIZED,
  );
};

export const http404 = (message: string) => {
  throw new HttpException(
    {
      message,
      status: HttpStatus.NOT_FOUND,
    },
    HttpStatus.NOT_FOUND,
  );
};

export const http500 = (message: string) => {
  throw new HttpException(
    {
      message,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
