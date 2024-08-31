import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = this.courseRepository.create(createCourseDto);
      return await this.courseRepository.save(course);
    } catch (error) {
      console.error(`Create course error: ${error.message}`);
      throw new InternalServerErrorException('Could not create course');
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ total: number; data: Course[] }> {
    try {
      const [courses, total] = await this.courseRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
      });
      return { total, data: courses };
    } catch (error) {
      console.error(`Find all courses error: ${error.message}`);
      throw new InternalServerErrorException('Could not fetch courses');
    }
  }

  async findOne(id: any): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne(id);
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
    } catch (error) {
      console.error(`Find course error: ${error.message}`);
      throw new InternalServerErrorException('Could not fetch course');
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.courseRepository.preload({ id, ...updateCourseDto });
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return await this.courseRepository.save(course);
    } catch (error) {
      console.error(`Update course error: ${error.message}`);
      throw new InternalServerErrorException('Could not update course');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.courseRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Remove course error: ${error.message}`);
      throw new InternalServerErrorException('Could not delete course');
    }
  }
}
