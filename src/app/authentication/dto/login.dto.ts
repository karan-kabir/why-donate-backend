import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";

export class LoginDTO {
 @ApiProperty({
   description: 'Email address of the user',
   example: 'karanschdev@gmail.com',
 })
 @IsNotEmpty()
 @IsEmail()
 username: string;

 @ApiProperty({
   description: 'Password in plain text',
   example: '123456',
 })
 @IsNotEmpty()
 password: string;
}
