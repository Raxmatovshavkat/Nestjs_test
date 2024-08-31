import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // Adjust the path if needed
import { OtpModule } from './otp/otp.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './Mail/mail.module';


@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    MailModule,
    OtpModule,
    JwtModule.register({
      global:true
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
})
export class AuthModule { }
