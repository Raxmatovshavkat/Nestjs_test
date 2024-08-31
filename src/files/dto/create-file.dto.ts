import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
    @ApiProperty({
        description: 'The name of the file',
        example: 'document.pdf',
    })
    @IsNotEmpty()
    @IsString()
    filename: string;

    @ApiProperty({
        description: 'The file extension',
        example: 'pdf',
    })
    @IsNotEmpty()
    @IsString()
    extension: string;

    @ApiProperty({
        description: 'The size of the file in bytes',
        example: 1024,
    })
    @IsNotEmpty()
    @IsNumber()
    filesize: number;

    @ApiProperty({
        description: 'The status of the file',
        enum: ['inactive', 'active'],
        example: 'active',
    })
    @IsEnum(['inactive', 'active'])
    status: 'inactive' | 'active';
}
