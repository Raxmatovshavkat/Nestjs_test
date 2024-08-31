import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) { }

  async create(createFileDto: CreateFileDto): Promise<File> {
    try {
      const file = this.fileRepository.create(createFileDto);
      return await this.fileRepository.save(file);
    } catch (error) {
      throw new InternalServerErrorException('Error creating file');
    }
  }

  async findAll(): Promise<File[]> {
    try {
      return await this.fileRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching files');
    }
  }

  async findOne(id: string): Promise<File> {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      return file;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching file');
    }
  }

  async update(id: string, updateFileDto: UpdateFileDto): Promise<File> {
    try {
      await this.fileRepository.update(id, updateFileDto);
      const updatedFile = await this.fileRepository.findOne({ where: { id } });
      if (!updatedFile) {
        throw new NotFoundException('File not found');
      }
      return updatedFile;
    } catch (error) {
      throw new InternalServerErrorException('Error updating file');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.fileRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('File not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting file');
    }
  }

  async getFileBuffer(id: string): Promise<Buffer> {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      const filePath = path.join(__dirname, '..', '..', 'uploads', file.filename);
      return fs.promises.readFile(filePath);
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving file');
    }
  }
}
