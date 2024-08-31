import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) { }

  async storeRefreshToken(token: string, user: User) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user,
      expiryDate,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string }> {
    const tokenData = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = this.jwtService.verify(refreshToken, { secret: process.env.DATABASE_ACCESS_TOKEN_SECRET });
    const newAccessToken = this.jwtService.sign(
      { sub: tokenData.user.id, email: tokenData.user.email },
      { secret: process.env.DATABASE_ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCES_EXPIRES_IN },
    );

    return { access_token: newAccessToken };
  }

  async removeTokensForUser(user: User): Promise<void> {
    await this.refreshTokenRepository.delete({ user });
  }
}
