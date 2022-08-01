import { User } from "src/app/user/responses/user";
import { Request } from 'express';

export interface RequestWithUser extends Request {
 user: User;
}
