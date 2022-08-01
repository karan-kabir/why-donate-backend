import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter as NestExceptionFilter, HttpException, Logger, LoggerService, UnauthorizedException } from '@nestjs/common';
import { Response } from "express"
import { GenericErrorFilterResponse } from './response_helper';

@Catch(Error)
export class ExceptionFilter<T> implements NestExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;
    console.log(exception);
    if(exception instanceof BadRequestException) {
      try{
        response
          .status(exception.getStatus())
          .json(GenericErrorFilterResponse(exception.getResponse()["message"].join(","), null, "ERROR", true));
      } catch {
        response
          .status(exception.getStatus())
          .json(GenericErrorFilterResponse(exception.message, null, "ERROR", true));
      }
    } else if(exception instanceof HttpException) {
      response
        .status(exception.getStatus())
        .json(GenericErrorFilterResponse(exception["message"], null, "ERROR", true));
    } else {
      response
        .status(status)
        .json(GenericErrorFilterResponse(exception["message"], null, "ERROR", true));
    }
    return;
  }
}
