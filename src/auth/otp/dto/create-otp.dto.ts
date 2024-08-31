import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOtpDto {
    @ApiProperty({
        description: 'The unique identifier of the user',
        example: 'a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14',
    })
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'The one-time password (OTP)',
        example: '123456',
    })
    @IsNotEmpty()
    @IsString()
    otp: string;
}
