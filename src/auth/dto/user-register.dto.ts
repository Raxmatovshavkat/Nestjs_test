import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'John',
        description: 'The first name of the user',
    })
    @IsString()
    @IsOptional()
    first_name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'The last name of the user',
    })
    @IsString()
    @IsOptional()
    last_name: string;
    @ApiProperty({
        example: 'johndoe@example.com',
        description: 'The email of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'The password of the user',
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'The status of the category',
        enum: ['inactive', 'active'],
        example: 'active',
    })
    @IsOptional()
    status: 'inactive' | 'active';
    
}
