import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import UserModule from './modules/user/UserModule';
import CourseModule from './modules/course/CourseModule';
import LessonModule from './modules/lesson/LessonModule';
import VideoModule from './modules/video/VideoModule';
import AttachmentModule from './modules/attachment/AttachmentModule';
import CategoryModule from './modules/category/CategoryModule';
import ClassModule from './modules/class/ClassModule';
import ClassAssignmentModule from './modules/class-assignment/ClassAssignmentModule';
import EnrollmentModule from './modules/enrollment/EnrollmentModule';
import ScholarshipModule from './modules/scholarship/ScholarshipModule';
import UserAssignmentModule from './modules/user-assignment/UserAssignmentModule';
import UserScheduleModule from './modules/user-schedule/UserScheduleModule';
import FormSubmissionModule from './modules/form-submission/FormSubmissionModule';
import AuthenticationModule from './modules/authentication/AuthenticationModule';
import InstructorModule from './modules/instructor/InstructorModule';
import PrivilegeModule from './modules/privilege/PrivilegeModule';
import TagModule from './modules/tag/TagModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV ? process.env.NODE_ENV.trim().toLowerCase() : 'development'}`,
      isGlobal: true,
    }),
    AttachmentModule,
    AuthenticationModule,
    CategoryModule,
    ClassModule,
    ClassAssignmentModule,
    CourseModule,
    EnrollmentModule,
    FormSubmissionModule,
    InstructorModule,
    LessonModule,
    PrivilegeModule,
    ScholarshipModule,
    TagModule,
    UserModule,
    UserAssignmentModule,
    UserScheduleModule,
    VideoModule,
  ],
})
export default class AppModule {}
