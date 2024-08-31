import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { Otp } from './entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]), 
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule { }
