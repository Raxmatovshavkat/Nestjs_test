import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateRefreshTokenDto {
    @ApiProperty({ description: 'User ID associated with the refresh token' })
    @IsString()
    @IsOptional()
    userId: string;

    @ApiProperty({ description: 'The refresh token string' })
    @IsString()
    @IsOptional()
    token: string;

    @ApiProperty({ description: 'Expiration date of the refresh token' })
    @IsDateString()
    @IsOptional()
    expiryDate: Date;
}
