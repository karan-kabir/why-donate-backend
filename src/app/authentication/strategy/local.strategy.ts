import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "src/app/user/responses/user";
import { AuthenticationService } from "../authentication.service";
import { Strategy } from 'passport-local';


@Injectable()
export class LocalStrategy  extends PassportStrategy(Strategy,'local') {
 constructor(private authenticationService: AuthenticationService) {
   super();
 }
 async validate(email: string, password: string): Promise<string> {
   return this.authenticationService.getAuthenticatedUser(email, password);
 }
}
