import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseFileService } from './course-file.service';
import { CourseFile } from './entities/course-file.entity';
import { File } from 'src/files/entities/file.entity';
import { Course } from 'src/course/entities/course.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([CourseFile, File, Course]), 
  ],
  providers: [CourseFileService],
  exports: [CourseFileService],
})
export class CourseFileModule {}
