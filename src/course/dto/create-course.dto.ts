import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
    @ApiProperty({
        description: 'The title of the course',
        example: 'Introduction to Programming',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'A brief description of the course',
        example: 'This course covers the basics of programming using Python.',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'The ID of the user creating the course',
        example: 'e7b0a9e8-4f2e-4dd5-9fb5-df9f79d0898f',
    })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
