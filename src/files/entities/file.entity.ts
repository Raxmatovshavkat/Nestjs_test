import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CourseFile } from 'src/course-file/entities/course-file.entity';

@Entity('files')
export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    extension: string;

    @Column()
    filesize: number;

    @OneToMany(() => CourseFile, courseFile => courseFile.file)
    courseFiles: CourseFile[];  
}
