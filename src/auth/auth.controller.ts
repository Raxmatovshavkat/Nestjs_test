import { Controller, Post, Body, Get, Param, Patch, Delete, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/user-register.dto';
import { LoginDto } from './dto/user-login.dto';
import { RefreshTokenDto } from './refresh-token/dto/create-refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async register(@Body() createRegisterDto: RegisterDto) {
    try {
      const user = await this.authService.register(createRegisterDto);
      return { message: 'User registered successfully', user };
    } catch (error) {
      console.error(`Registration error: ${error.message}`);
      throw new InternalServerErrorException('Could not register user');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async login(@Body() createLoginDto: LoginDto) {
    try {
      const tokens = await this.authService.signIn(createLoginDto);
      return tokens;
    } catch (error) {
      console.error(`Login error: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto }) // Use the correct DTO here
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      // console.log('Received refresh token DTO:', refreshTokenDto); // Debugging
      const accessToken = await this.authService.refreshAccessToken(refreshTokenDto.token);
      return { access_token: accessToken.accessToken };
    } catch (error) {
      console.error(`Refresh token error: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  


  @Get('me/:id')
  @ApiOperation({ summary: 'Get current user by ID' })
  @ApiResponse({ status: 200, description: 'User fetched successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async me(@Param('id') id: string) {
    try {
      const user = await this.authService.me(id);
      return user;
    } catch (error) {
      console.error(`Fetch user error: ${error.message}`);
      throw new UnauthorizedException('User not found');
    }
  }

  @Delete('logout/:userId')
  @ApiOperation({ summary: 'Logout a user and remove refresh tokens' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async logout(@Param('userId') userId: string) {
    try {
      await this.authService.logout(userId);
      return { message: 'User logged out successfully' };
    } catch (error) {
      console.error(`Logout error: ${error.message}`);
      throw new InternalServerErrorException('Could not logout user');
    }
  }

  @Patch('verify/:userId')
  @ApiOperation({ summary: 'Verify user with OTP' })
  @ApiResponse({ status: 200, description: 'User verified successfully.' })
  @ApiResponse({ status: 401, description: 'OTP verification failed.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async verify(@Param('userId') userId: string, @Body('otp') otp: string) {
    try {
      await this.authService.verify(userId, otp);
      return { message: 'User verified successfully' };
    } catch (error) {
      console.error(`OTP verification error: ${error.message}`);
      throw new UnauthorizedException('Invalid OTP');
    }
  }
}
