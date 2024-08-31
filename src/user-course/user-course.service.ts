import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { UserCourse } from './entities/user-course.entity';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(UserCourse)
    private readonly userCourseRepository: Repository<UserCourse>,
  ) {}

  async create(createUserCourseDto: CreateUserCourseDto): Promise<UserCourse> {
    try {
      const userCourse = this.userCourseRepository.create(createUserCourseDto);
      return await this.userCourseRepository.save(userCourse);
    } catch (error) {
      throw new Error('Failed to create user course: ' + error.message);
    }
  }

  async findAll(): Promise<UserCourse[]> {
    try {
      return await this.userCourseRepository.find();
    } catch (error) {
      throw new Error('Failed to retrieve user courses: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userCourseRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`UserCourse with ID ${id} not found`);
      }
    } catch (error) {
      throw new Error('Failed to delete user course: ' + error.message);
    }
  }
}
