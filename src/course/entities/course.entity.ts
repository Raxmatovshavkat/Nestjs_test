import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CourseFile } from 'src/course-file/entities/course-file.entity';


@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => User, user => user.courses)
    user: User;

    @OneToMany(() => CourseFile, courseFile => courseFile.course)
    courseFiles: CourseFile[];
}
