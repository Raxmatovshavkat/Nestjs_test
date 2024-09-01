import { Controller, Get, Post, Body, Patch, Param, Delete, Query, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('courses')
// @UseGuards(JwtAuthGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      const course = await this.courseService.create(createCourseDto);
      return { message: 'Course created successfully', course };
    } catch (error) {
      console.error(`Create course error: ${error.message}`);
      throw new InternalServerErrorException('Could not create course');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const courses = await this.courseService.findAll(page, limit);
      return courses;
    } catch (error) {
      console.error(`Find all courses error: ${error.message}`);
      throw new InternalServerErrorException('Could not fetch courses');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: string) {
    try {
      const course = await this.courseService.findOne(id);
      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Find course error: ${error.message}`);
      throw new InternalServerErrorException('Could not fetch course');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course by ID' })
  @ApiResponse({ status: 200, description: 'Course updated successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.courseService.update(id, updateCourseDto);
      return { message: 'Course updated successfully', course };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Update course error: ${error.message}`);
      throw new InternalServerErrorException('Could not update course');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course by ID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async remove(@Param('id') id: string) {
    try {
      await this.courseService.remove(id);
      return { message: 'Course deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Remove course error: ${error.message}`);
      throw new InternalServerErrorException('Could not delete course');
    }
  }
}
