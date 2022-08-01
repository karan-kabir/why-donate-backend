import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { RequestWithUser } from './interface/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { GenericSuccessResponse } from '../common/response_helper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @HttpCode(200)
  @Post('/log-in')
  @UseGuards(AuthGuard('local'))
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    console.log(user);
    const accessTokenCookie =
      await this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', [
      accessTokenCookie['Authentication'],
    ]);
    return response.send(
      GenericSuccessResponse({
        email: user.email,
        token_access: 'check your cookies for jwt token in httpOnly',
        token: accessTokenCookie['token']
      }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/imdb-search-result-by-title')
  async getUser(@Query('title') title: string) {
    const result = await this.authenticationService.getSearch(title);
    return GenericSuccessResponse(result);
  }

  @Post('/log-out')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async logOut(@Body() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    console.log(user);
    return user;
  }
}
