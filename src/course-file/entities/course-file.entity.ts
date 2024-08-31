import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { File } from 'src/files/entities/file.entity';

@Entity('course_files')
export class CourseFile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Course, course => course.courseFiles, { eager: true, onDelete: 'CASCADE' })
    course: Course;

    @ManyToOne(() => File, file => file.courseFiles, { eager: true, onDelete: 'CASCADE' })
    file: File;
}
