import { Global, Module } from '@nestjs/common';
import AttachmentDynamoDBRepository from './attachment/data-access/repository/repository/AttachmentDynamoDBRepository';
import { DependencyInjection } from '../common/common-domain/DependencyInjection';
import AttachmentRepositoryImpl from './attachment/data-access/repository/adapter/AttachmentRepositoryImpl';
import CategoryDynamoDBRepository from './category/data-access/database/repository/CategoryDynamoDBRepository';
import CategoryRepositoryImpl from './category/data-access/database/adapter/CategoryRepositoryImpl';
import ClassDynamoDBRepository from './class/data-access/database/repository/ClassDynamoDBRepository';
import ClassRepositoryImpl from './class/data-access/database/adapter/ClassRepositoryImpl';
import ClassAssignmentDynamoDBRepository from './class-assignment/data-access/database/repository/ClassAssignmentDynamoDBRepository';
import ClassAssignmentRepositoryImpl from './class-assignment/data-access/database/adapter/ClassAssignmentRepositoryImpl';
import CourseDynamoDBRepository from './course/data-access/database/repository/CourseDynamoDBRepository';
import CourseRepositoryImpl from './course/data-access/database/adapter/CourseRepositoryImpl';
import CourseScheduleDynamoDBRepository from './course-schedule/data-access/database/repository/CourseScheduleDynamoDBRepository';
import CourseScheduleRepositoryImpl from './course-schedule/data-access/database/adapter/CourseScheduleRepositoryImpl';
import EnrollmentDynamoDBRepository from './enrollment/data-access/database/repository/EnrollmentDynamoDBRepository';
import EnrollmentRepositoryImpl from './enrollment/data-access/database/adapter/EnrollmentRepositoryImpl';
import FormSubmissionDynamoDBRepository from './form-submission/data-access/database/repository/FormSubmissinDynamoDBRepository';
import FormSubmissionRepositoryImpl from './form-submission/data-access/database/adapter/FormSubmissionRepositoryImpl';
import InstructorDynamoDBRepository from './instructor/data-access/database/repository/InstructorDynamoDBRepository';
import InstructorRepositoryImpl from './instructor/data-access/database/adapter/InstructorRepositoryImpl';
import LessonDynamoDBRepository from './lesson/data-access/database/repository/LessonDynamoDBRepository';
import LessonRepositoryImpl from './lesson/data-access/database/adapter/LessonRepositoryImpl';
import NotificationRepositoryImpl from './notification/data-access/database/adapter/NotificationRepositoryImpl';
import PrivilegeRepositoryImpl from './privilege/data-access/database/adapter/PrivilegeRepositoryImpl';
import NotificationDynamoDBRepository from './notification/data-access/database/repository/NotificationDynamoDBRepository';
import PrivilegeDynamoDBRepository from './privilege/data-access/database/repository/PrivilegeDynamoDBRepository';
import ScholarshipDynamoDBRepository from './scholarship/data-access/database/repository/ScholarshipDynamoDBRepository';
import ScholarshipRepositoryImpl from './scholarship/data-access/database/adapter/ScholarshipRepositoryImpl';
import TagDynamoDBRepository from './tag/data-access/database/repository/TagDynamoDBRepository';
import TagRepositoryImpl from './tag/data-access/database/adapter/TagRepositoryImpl';
import UserRepositoryImpl from './user/data-access/database/adapter/UserRepositoryImpl';
import UserAssignmentRepositoryImpl from './user-assignment/data-access/database/adapter/UserAssignmentRepositoryImpl';
import UserScheduleRepositoryImpl from './user-schedule/data-access/database/adapter/UserScheduleRepositoryImpl';
import UserDynamoDBRepository from './user/data-access/database/repository/UserDynamoDBRepository';
import UserAssignmentDynamoDBRepository from './user-assignment/data-access/database/repository/UserAssignmentDynamoDBRepository';
import UserScheduleDynamoDBRepository from './user-schedule/data-access/database/repository/UserScheduleDynamoDBRepository';
import VideoDynamoDBRepository from './video/data-access/database/repository/VideoDynamoDBRepository';
import VideoRepositoryImpl from './video/data-access/database/adapter/VideoRepositoryImpl';
import CourseCacheMemoryImpl from './course/data-access/cache/adapter/CourseCacheMemoryImpl';
import CourseRedisCacheMemory from './course/data-access/cache/memory/CourseRedisCacheMemory';

@Global()
@Module({
  imports: [],
  providers: [
    AttachmentDynamoDBRepository,
    {
      provide: DependencyInjection.ATTACHMENT_REPOSITORY,
      useClass: AttachmentRepositoryImpl,
    },
    CategoryDynamoDBRepository,
    {
      provide: DependencyInjection.CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
    ClassDynamoDBRepository,
    {
      provide: DependencyInjection.CLASS_REPOSITORY,
      useClass: ClassRepositoryImpl,
    },
    ClassAssignmentDynamoDBRepository,
    {
      provide: DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY,
      useClass: ClassAssignmentRepositoryImpl,
    },
    CourseDynamoDBRepository,
    {
      provide: DependencyInjection.COURSE_REPOSITORY,
      useClass: CourseRepositoryImpl,
    },
    CourseScheduleDynamoDBRepository,
    {
      provide: DependencyInjection.COURSE_SCHEDULE_REPOSITORY,
      useClass: CourseScheduleRepositoryImpl,
    },
    EnrollmentDynamoDBRepository,
    {
      provide: DependencyInjection.ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepositoryImpl,
    },
    FormSubmissionDynamoDBRepository,
    {
      provide: DependencyInjection.FORM_SUBMISSION_REPOSITORY,
      useClass: FormSubmissionRepositoryImpl,
    },
    InstructorDynamoDBRepository,
    {
      provide: DependencyInjection.INSTRUCTOR_REPOSITORY,
      useClass: InstructorRepositoryImpl,
    },
    LessonDynamoDBRepository,
    {
      provide: DependencyInjection.LESSON_REPOSITORY,
      useClass: LessonRepositoryImpl,
    },
    NotificationDynamoDBRepository,
    {
      provide: DependencyInjection.NOTIFICATION_REPOSITORY,
      useClass: NotificationRepositoryImpl,
    },
    PrivilegeDynamoDBRepository,
    {
      provide: DependencyInjection.PRIVILEGE_REPOSITORY,
      useClass: PrivilegeRepositoryImpl,
    },
    ScholarshipDynamoDBRepository,
    {
      provide: DependencyInjection.SCHOLARSHIP_REPOSITORY,
      useClass: ScholarshipRepositoryImpl,
    },
    TagDynamoDBRepository,
    {
      provide: DependencyInjection.TAG_REPOSITORY,
      useClass: TagRepositoryImpl,
    },
    UserDynamoDBRepository,
    {
      provide: DependencyInjection.USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    UserAssignmentDynamoDBRepository,
    {
      provide: DependencyInjection.USER_ASSIGNMENT_REPOSITORY,
      useClass: UserAssignmentRepositoryImpl,
    },
    UserScheduleDynamoDBRepository,
    {
      provide: DependencyInjection.USER_SCHEDULE_REPOSITORY,
      useClass: UserScheduleRepositoryImpl,
    },
    VideoDynamoDBRepository,
    {
      provide: DependencyInjection.VIDEO_REPOSITORY,
      useClass: VideoRepositoryImpl,
    },

    {
      provide: DependencyInjection.COURSE_CACHE_MEMORY,
      useClass: CourseCacheMemoryImpl,
    },
    {
      provide: DependencyInjection.COURSE_REDIS_CACHE_MEMORY,
      useClass: CourseRedisCacheMemory,
    },
  ],
  exports: [
    AttachmentDynamoDBRepository,
    {
      provide: DependencyInjection.ATTACHMENT_REPOSITORY,
      useClass: AttachmentRepositoryImpl,
    },
    CategoryDynamoDBRepository,
    {
      provide: DependencyInjection.CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
    ClassDynamoDBRepository,
    {
      provide: DependencyInjection.CLASS_REPOSITORY,
      useClass: ClassRepositoryImpl,
    },
    ClassAssignmentDynamoDBRepository,
    {
      provide: DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY,
      useClass: ClassAssignmentRepositoryImpl,
    },
    CourseDynamoDBRepository,
    {
      provide: DependencyInjection.COURSE_REPOSITORY,
      useClass: CourseRepositoryImpl,
    },
    CourseScheduleDynamoDBRepository,
    {
      provide: DependencyInjection.COURSE_SCHEDULE_REPOSITORY,
      useClass: CourseScheduleRepositoryImpl,
    },
    EnrollmentDynamoDBRepository,
    {
      provide: DependencyInjection.ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepositoryImpl,
    },
    FormSubmissionDynamoDBRepository,
    {
      provide: DependencyInjection.FORM_SUBMISSION_REPOSITORY,
      useClass: FormSubmissionRepositoryImpl,
    },
    InstructorDynamoDBRepository,
    {
      provide: DependencyInjection.INSTRUCTOR_REPOSITORY,
      useClass: InstructorRepositoryImpl,
    },
    LessonDynamoDBRepository,
    {
      provide: DependencyInjection.LESSON_REPOSITORY,
      useClass: LessonRepositoryImpl,
    },
    NotificationDynamoDBRepository,
    {
      provide: DependencyInjection.NOTIFICATION_REPOSITORY,
      useClass: NotificationRepositoryImpl,
    },
    PrivilegeDynamoDBRepository,
    {
      provide: DependencyInjection.PRIVILEGE_REPOSITORY,
      useClass: PrivilegeRepositoryImpl,
    },
    ScholarshipDynamoDBRepository,
    {
      provide: DependencyInjection.SCHOLARSHIP_REPOSITORY,
      useClass: ScholarshipRepositoryImpl,
    },
    TagDynamoDBRepository,
    {
      provide: DependencyInjection.TAG_REPOSITORY,
      useClass: TagRepositoryImpl,
    },
    UserDynamoDBRepository,
    {
      provide: DependencyInjection.USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    UserAssignmentDynamoDBRepository,
    {
      provide: DependencyInjection.USER_ASSIGNMENT_REPOSITORY,
      useClass: UserAssignmentRepositoryImpl,
    },
    UserScheduleDynamoDBRepository,
    {
      provide: DependencyInjection.USER_SCHEDULE_REPOSITORY,
      useClass: UserScheduleRepositoryImpl,
    },
    VideoDynamoDBRepository,
    {
      provide: DependencyInjection.VIDEO_REPOSITORY,
      useClass: VideoRepositoryImpl,
    },

    {
      provide: DependencyInjection.COURSE_CACHE_MEMORY,
      useClass: CourseCacheMemoryImpl,
    },
    {
      provide: DependencyInjection.COURSE_REDIS_CACHE_MEMORY,
      useClass: CourseRedisCacheMemory,
    },
  ],
})
export default class DataAccessModule {}
