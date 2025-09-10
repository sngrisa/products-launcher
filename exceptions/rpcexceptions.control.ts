import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const rpcError = exception.getError();

     const name: string = rpcError.toString();

    if (name.includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: name.substring(0, name.indexOf('(') - 1)
      })
    }

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const { status, message } = rpcError as { status: number; message: string };
      return {
        status: isNaN(+status) ? 400 : +status,
        message,
      };
    }

    return {
      status: 400,
      message: typeof rpcError === 'string' ? rpcError : 'Unexpected error',
    };
  }
}
