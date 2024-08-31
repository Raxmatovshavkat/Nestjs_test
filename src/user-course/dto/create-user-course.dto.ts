import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserCourseDto {
  @ApiProperty({
    description: 'Name of the user course',
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID of the user associated with the course',
    example: 'b8b3c234-f344-4d80-9c7b-d1a6f7d9d752',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
