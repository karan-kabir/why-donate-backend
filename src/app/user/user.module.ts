import {  Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule],
  exports:[UserService],
  providers: [UserService]
})
export class UserModule {}
