import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: 'John',
        description: 'The first name of the user',
    })
    @IsString()
    first_name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'The last name of the user',
    })
    @IsString()
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

    @ApiPropertyOptional({
        example: 'client',
        enum: ['client', 'owner', 'supervisor', 'admin'],
        description: 'The role of the user',
    })
    @IsOptional()
    @IsEnum(['client', 'owner', 'supervisor', 'admin'])
    role?: 'client' | 'owner' | 'supervisor' | 'admin';

    @ApiProperty({
        description: 'The status of the category',
        enum: ['inactive', 'active'],
        example: 'active',
    })
    @IsEnum(['inactive', 'active'])
    @IsOptional()
    status: 'inactive' | 'active';
}
