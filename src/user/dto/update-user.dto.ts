import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: 'John',
        description: 'The first name of the user',
    })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiPropertyOptional({
        example: 'Doe',
        description: 'The last name of the user',
    })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiPropertyOptional({
        example: 'password123',
        description: 'The password of the user',
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @ApiPropertyOptional({
        example: 'active',
        enum: ['inactive', 'active'],
        description: 'The status of the user',
    })
    @IsOptional()
    @IsEnum(['inactive', 'active'])
    status?: 'inactive' | 'active';

    @ApiPropertyOptional({
        example: 'client',
        enum: ['client', 'owner', 'supervisor', 'admin'],
        description: 'The role of the user',
    })
    @IsOptional()
    @IsEnum(['client', 'owner', 'supervisor', 'admin'])
    role?: 'client' | 'owner' | 'supervisor' | 'admin';
}
