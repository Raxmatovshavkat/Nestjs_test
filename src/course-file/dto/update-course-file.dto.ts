import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseFileDto } from './create-course-file.dto';

export class UpdateCourseFileDto extends PartialType(CreateCourseFileDto) {}
