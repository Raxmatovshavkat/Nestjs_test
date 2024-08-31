import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'johndoe@example.com',
        description: 'The email address of the user attempting to log in',
    })
    @IsEmail()
    email: any;

    @ApiProperty({
        example: 'password123',
        description: 'The password of the user attempting to log in',
    })
    @IsString()
    password: string;
}
