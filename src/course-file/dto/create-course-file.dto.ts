import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCourseFileDto {
  @ApiProperty({
    description: 'The UUID of the course',
    example: 'a9c7b57b-cf2d-4b4a-88b8-4189f451c5c1',
  })
  @IsUUID('4')
  @IsNotEmpty()
  readonly courseId: string;

  @ApiProperty({
    description: 'The UUID of the file',
    example: 'd26e54f0-82a4-4f0c-9f69-26dc77b80f72',
  })
  @IsUUID('4')
  @IsNotEmpty()
  readonly fileId: string;
}
