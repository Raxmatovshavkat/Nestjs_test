// src/user-course/user-course.controller.ts
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCourse } from './entities/user-course.entity';

@ApiTags('user-course')
@ApiBearerAuth()
@Controller('user-course')
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Post()
  @ApiOperation({ summary: 'Set course for user' })
  @ApiResponse({ status: 201, description: 'Course has been successfully added to user', type: UserCourse })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserCourseDto: CreateUserCourseDto) {
    try {
      return await this.userCourseService.create(createUserCourseDto);
    } catch (error) {
      throw new Error('Failed to create user course: ' + error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all user courses' })
  @ApiResponse({ status: 200, description: 'Returns all user courses', type: [UserCourse] })
  async findAll() {
    try {
      return await this.userCourseService.findAll();
    } catch (error) {
      throw new Error('Failed to retrieve user courses: ' + error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user course by ID' })
  @ApiResponse({ status: 204, description: 'User course has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'User course not found' })
  async remove(@Param('id') id: string) {
    try {
      await this.userCourseService.remove(id);
    } catch (error) {
      throw new Error('Failed to delete user course: ' + error.message);
    }
  }
}
