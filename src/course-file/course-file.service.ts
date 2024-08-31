import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseFileDto } from './dto/create-course-file.dto';
import { CourseFile } from './entities/course-file.entity';
import { Course } from '../course/entities/course.entity';
import { File } from '../files/entities/file.entity';

@Injectable()
export class CourseFileService {
  constructor(
    @InjectRepository(CourseFile)
    private readonly courseFileRepository: Repository<CourseFile>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(createCourseFileDto: CreateCourseFileDto): Promise<CourseFile> {
    const { courseId, fileId } = createCourseFileDto;

    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const courseFile = this.courseFileRepository.create({
      course,
      file,
    });

    return this.courseFileRepository.save(courseFile);
  }

  async findAll(): Promise<CourseFile[]> {
    return this.courseFileRepository.find();
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseFileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Course file not found');
    }
  }
}
