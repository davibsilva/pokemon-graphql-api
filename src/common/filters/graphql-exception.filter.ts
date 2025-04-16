import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): GraphQLError {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : 500;

    let message = 'Internal server error';
    let formattedErrors: any[] = [];

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      const validationErrors = (response as any).message;

      if (Array.isArray(validationErrors)) {
        const errorMap = new Map<string, string[]>();

        validationErrors.forEach((msg: string) => {
          const [field] = msg.split(' ');
          const cleanMsg = msg.trim();
          if (!errorMap.has(field)) errorMap.set(field, []);
          errorMap.get(field)?.push(cleanMsg);
        });

        formattedErrors = Array.from(errorMap.entries()).map(
          ([field, messages]) => ({
            field,
            messages,
          }),
        );

        message = 'Validation failed';
      } else {
        message = exception.message;
      }
    } else {
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
    }

    const formattedError: GraphQLFormattedError = {
      message,
      extensions: {
        code: this.mapStatusCodeToErrorCode(status),
        status,
        path: info?.fieldName,
        errors: formattedErrors.length > 0 ? formattedErrors : undefined,
      },
    };

    return new GraphQLError(formattedError.message, {
      extensions: formattedError.extensions,
    });
  }

  private mapStatusCodeToErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_USER_INPUT',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_SERVER_ERROR',
    };
    return codes[status] || 'INTERNAL_SERVER_ERROR';
  }
}
