import { Controller, Get, Post, Body, Param, Delete, Put, UploadedFile, UseInterceptors, Res, Header, HttpException, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file upload' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
    if (!file) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
    return await this.filesService.create({ ...createFileDto, filename: file.filename });
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async findAll() {
    return await this.filesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a file by ID' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async findOne(@Param('id') id: string) {
    return await this.filesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update file info' })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return await this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async remove(@Param('id') id: string) {
    return await this.filesService.remove(id);
  }

  @Get(':id/download')
  @Header('Content-Type', 'application/octet-stream')
  @ApiOperation({ summary: 'Download a file' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async download(@Param('id') id: string, @Res() res: Response) {
    try {
      const fileBuffer = await this.filesService.getFileBuffer(id);
      const file = await this.filesService.findOne(id);
      res.set({
        'Content-Disposition': `attachment; filename="${file.filename}"`,
        'Content-Length': fileBuffer.length,
      });
      res.end(fileBuffer);
    } catch (error) {
      res.status(error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
