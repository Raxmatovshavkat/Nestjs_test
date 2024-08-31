import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { User } from 'src/user/entities/user.entity';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { OtpService } from './otp/otp.service';
import { RegisterDto } from './dto/user-register.dto';
import { LoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import * as otpGenerator from 'otp-generator';
import { EmailService } from './Mail/mail.service';
import { UserService } from 'src/user/user.service';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshService: RefreshTokenService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService
  ) { }

  async register(createUserDto: RegisterDto): Promise<User> {
    try {
      const { first_name, last_name, email, password } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = { ...createUserDto, password: hashedPassword };

      const user = await this.userRepository.create(newUser);

      const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });

      await this.emailService.sendEmail(email, otp);
      await this.otpService.saveOtp({ userId: user.id, otp });

      return user;
    } catch (error) {
      console.error('Registration error:', error.message);
      throw new InternalServerErrorException('Failed to register user');
    }
  }


  async verify(userId: string, otp: string): Promise<void> {
    try {
      await this.otpService.verifyOtp(userId, otp);
      await this.userRepository.update(userId, { status: 'active' });
    } catch (error) {
      console.error(`OTP verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid OTP');
    }
  }

  async signIn(createLoginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userRepository.signin(createLoginDto);
      // console.log(user);
      console.log('salom');

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

      if (!accessTokenSecret || !refreshTokenSecret) {
        throw new InternalServerErrorException('JWT secret not configured');
      }

      const payload = { sub: user.id.toString(), email: user.email };
      const accessToken = this.jwtService.sign(payload, {
        secret: accessTokenSecret,
        expiresIn: process.env.ACCESS_EXPIRES_IN || '1h', // default to 1 hour if not set
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: refreshTokenSecret,
        expiresIn: process.env.REFRESH_EXPIRES_IN || '7d', // default to 7 days if not set
      });

      await this.refreshService.storeRefreshToken(refreshToken, user);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      console.error(`Sign-in failed: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    // console.log(`Received refresh token: ${refreshToken}`);
    console.log(refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token must be provided');
    }
    // console.log(refreshToken);
    

    const tokenData = await this.refreshService.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });

      const newAccessToken = this.jwtService.sign(
        { sub: tokenData.user.id, email: tokenData.user.email },
        { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_EXPIRES_IN },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error(`Error in refreshAccessToken: ${error.message}`);
      throw new UnauthorizedException('Failed to refresh access token');
    }
  }



  async me(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne(id);
    } catch (error) {
      console.error(`Fetching user failed: ${error.message}`);
      throw new UnauthorizedException('User not found');
    }
  }

  async logout(userId: any): Promise<void> {
    try {
      await this.refreshService.removeTokensForUser(userId);
    } catch (error) {
      console.error(`Logout failed: ${error.message}`);
      throw new InternalServerErrorException('Failed to logout');
    }
  }

}
