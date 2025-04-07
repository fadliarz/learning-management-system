import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import CreateCourseCommandHandler from '../../domain/application-service/features/create-course/CreateCourseCommandHandler';
import CreateCourseDto from '../../domain/application-service/features/create-course/dto/CreateCourseDto';
import GetCoursesQueryHandler from '../../domain/application-service/features/get-courses/GetCoursesQueryHandler';
import GetCourseQueryHandler from '../../domain/application-service/features/get-course/GetCourseQueryHandler';
import UpdateCourseCommandHandler from '../../domain/application-service/features/update-course/UpdateCourseCommandHandler';
import UpdateCourseDto from '../../domain/application-service/features/update-course/dto/UpdateCourseDto';
import DeleteCourseCommandHandler from '../../domain/application-service/features/delete-course/DeleteCourseCommandHandler';
import CoursesWrapperResponse from './response/CoursesWrapperResponse';
import CourseWrapperResponse from './response/CourseWrapperResponse';
import AddCourseCategoryCommandHandler from '../../domain/application-service/features/add-category/AddCourseCategoryCommandHandler';
import AddCourseCategoryDto from '../../domain/application-service/features/add-category/dto/AddCourseCategoryDto';
import GetCoursesDto from '../../domain/application-service/features/get-courses/dto/GetCoursesDto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
@Controller('api/v1/courses')
@ApiTags('Course')
export default class CourseController {
  constructor(
    private readonly createCourseCommandHandler: CreateCourseCommandHandler,
    private readonly addCourseCategoryCommandHandler: AddCourseCategoryCommandHandler,
    private readonly getCoursesQueryHandler: GetCoursesQueryHandler,
    private readonly getCourseQueryHandler: GetCourseQueryHandler,
    private readonly updateCourseCommandHandler: UpdateCourseCommandHandler,
    private readonly deleteCourseCommandHandler: DeleteCourseCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a course' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Course created successfully.',
    type: CourseWrapperResponse,
  })
  public async createCourse(
    @Req() request: FastifyRequest,
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseWrapperResponse> {
    return new CourseWrapperResponse(
      await this.createCourseCommandHandler.execute({
        executor: request.executor,
        ...createCourseDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Post(':courseId/add-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add category to a course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category added successfully.',
  })
  public async addCategory(
    @Req() request: FastifyRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() addCourseCategoryDto: AddCourseCategoryDto,
  ): Promise<void> {
    await this.addCourseCategoryCommandHandler.execute({
      executor: request.executor,
      courseId,
      ...addCourseCategoryDto,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Courses retrieved successfully',
    type: CoursesWrapperResponse,
  })
  public async getCourses(
    @Query() query: any,
  ): Promise<CoursesWrapperResponse> {
    const getCoursesDto: GetCoursesDto = plainToClass(GetCoursesDto, query);
    if (getCoursesDto.categories) {
      if (!Array.isArray(getCoursesDto.categories)) {
        getCoursesDto.categories = [getCoursesDto.categories];
      }
      getCoursesDto.categories = getCoursesDto.categories.map((category) =>
        Number(category),
      );
    }
    const errors = await validate(getCoursesDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }
    return new CoursesWrapperResponse(
      await this.getCoursesQueryHandler.execute({
        ...getCoursesDto,
      }),
    );
  }

  @Get(':courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course retrieved successfully',
    type: CourseWrapperResponse,
  })
  public async getCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<CourseWrapperResponse> {
    return new CourseWrapperResponse(
      await this.getCourseQueryHandler.execute({
        courseId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course updated successfully',
    type: CourseWrapperResponse,
  })
  public async updateCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() request: FastifyRequest,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseWrapperResponse> {
    return new CourseWrapperResponse(
      await this.updateCourseCommandHandler.execute({
        executor: request.executor,
        courseId,
        ...updateCourseDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':courseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Course deleted successfully',
  })
  public async deleteCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteCourseCommandHandler.execute({
      executor: request.executor,
      courseId,
    });
  }
}
