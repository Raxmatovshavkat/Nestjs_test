import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Otp } from 'src/auth/otp/entities/otp.entity';
import { RefreshToken } from 'src/auth/refresh-token/entities/refresh-token.entity';
import { UserCourse } from 'src/user-course/entities/user-course.entity';
import { Course } from 'src/course/entities/course.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'enum', enum: ['client', 'owner', 'supervisor', 'admin'], default: 'client' })
    role: 'client' | 'owner' | 'supervisor' | 'admin';

    @Column({ type: 'enum', enum: ['inactive', 'active'],default:'inactive'})
    status: 'inactive' | 'active';

    @OneToMany(() => Otp, otp => otp.user)  
    otps: Otp[];

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => UserCourse, userCourse => userCourse.user)
    userCourses: UserCourse[];

    @OneToMany(() => Course, course => course.user)
    courses: Course[];
}
