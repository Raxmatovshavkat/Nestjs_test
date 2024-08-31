import { Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { CreateOtpDto } from './dto/create-otp.dto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>
  ) { }

  async findOtpByUserIdAndOtp(userId: string, otp: string): Promise<Otp | null> {
    if (!userId) {
      this.logger.error('userId is undefined');
      throw new Error('userId is undefined');
    }
    this.logger.log(`Finding OTP for userId: ${userId}`);
    return await this.otpRepository.findOne({ where: { userId, otp } });
  }

  async saveOtp(createOtpDto: CreateOtpDto): Promise<Otp> {
    this.logger.log(`Saving OTP for userId: ${createOtpDto.userId}`);
    const otp = this.otpRepository.create(createOtpDto);
    return await this.otpRepository.save(otp);
  }

  async remove(id: string): Promise<void> {
    const otp = await this.otpRepository.findOne({ where: { id } });
    if (!otp) {
      this.logger.error('OTP not found');
      throw new NotFoundException('OTP not found');
    }
    await this.otpRepository.remove(otp);
    this.logger.log(`OTP with id ${id} removed`);
  }

  async verifyOtp(userId: string, otp: string): Promise<void> {
    this.logger.log(`Verifying OTP for userId: ${userId}`);
    const savedOtp = await this.findOtpByUserIdAndOtp(userId, otp);
    if (!savedOtp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    await this.remove(savedOtp.id);
  }
}
