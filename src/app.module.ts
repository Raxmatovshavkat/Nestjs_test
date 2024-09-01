import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './course/course.module';
import { CourseFileModule } from './course-file/course-file.module';
import { UserCourseModule } from './user-course/user-course.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/db';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig(),
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
    }),
    CourseModule,
    CourseFileModule,
    UserCourseModule,
    UserModule,
    AuthModule,
    FilesModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
