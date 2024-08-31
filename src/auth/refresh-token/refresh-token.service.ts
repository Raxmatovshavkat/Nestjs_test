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

  async storeRefreshToken(token: any, user: User) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user,
      expiryDate,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async findOne(criteria: any): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: criteria.where,
      relations: criteria.relations,
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const tokenData = await this.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });
    // console.log(tokenData);
    

    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });

    const newAccessToken = this.jwtService.sign(
      { sub: tokenData.user.id, email: tokenData.user.email },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_EXPIRES_IN },
    );

    return { accessToken: newAccessToken };
  }

  async removeTokensForUser(user: User): Promise<void> {
    await this.refreshTokenRepository.delete({ user });
  }
}