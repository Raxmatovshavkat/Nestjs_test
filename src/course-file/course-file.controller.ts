import { Controller, Post, Get, Delete, Param, Body, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { CourseFileService } from './course-file.service';
import { CreateCourseFileDto } from './dto/create-course-file.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('course-file')
@ApiBearerAuth() // Indicates that the endpoints require a bearer token
@Controller('course-file')
export class CourseFileController {
  constructor(private readonly courseFileService: CourseFileService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Apply the JWT guard to protect this route
  @ApiOperation({ summary: 'Create a new course file' })
  @ApiResponse({ status: 201, description: 'Course file created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createCourseFileDto: CreateCourseFileDto) {
    try {
      return await this.courseFileService.create(createCourseFileDto);
    } catch (error) {
      console.error(`Error creating course file: ${error.message}`);
      throw new InternalServerErrorException('Could not create course file');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all course files' })
  @ApiResponse({ status: 200, description: 'List of course files retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      return await this.courseFileService.findAll();
    } catch (error) {
      console.error(`Error retrieving course files: ${error.message}`);
      throw new InternalServerErrorException('Could not retrieve course files');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Apply the JWT guard to protect this route
  @ApiOperation({ summary: 'Delete a course file by ID' })
  @ApiResponse({ status: 200, description: 'Course file deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Course file not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string) {
    try {
      await this.courseFileService.remove(id);
      return { message: 'Course file deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw not found exceptions to handle them as 404 errors
      }
      console.error(`Error removing course file: ${error.message}`);
      throw new InternalServerErrorException('Could not remove course file');
    }
  }
}
