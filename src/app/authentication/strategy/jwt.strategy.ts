import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';
import { TokenPayload } from "../interface/token-payload.interface";
import { UserService } from "src/app/user/user.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,"jwt") {
 constructor(
   private readonly configService: ConfigService,
   private readonly userService: UserService,
 ) {
   super({
     jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
       return request?.cookies?.Authentication;
     }]),
     secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET')
   });
 }

 async validate(payload: TokenPayload) {
   return this.userService.getById(payload.userId);
 }
}
