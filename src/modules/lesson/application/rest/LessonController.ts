import {
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
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateLessonCommandHandler from '../../domain/application-service/features/create-lesson/CreateLessonCommandHandler';
import GetLessonQueryHandler from '../../domain/application-service/features/get-lesson/GetLessonQueryHandler';
import GetLessonsQueryHandler from '../../domain/application-service/features/get-lessons/GetLessonsQueryHandler';
import UpdateLessonCommandHandler from '../../domain/application-service/features/update-lesson/UpdateLessonCommandHandler';
import UpdateLessonPositionCommandHandler from '../../domain/application-service/features/update-lesson-position/UpdateLessonPositionCommandHandler';
import DeleteLessonCommandHandler from '../../domain/application-service/features/delete-lesson/DeleteLessonCommandHandler';
import CreateLessonDto from '../../domain/application-service/features/create-lesson/dto/CreateLessonDto';
import UpdateLessonDto from '../../domain/application-service/features/update-lesson/dto/UpdateLessonDto';
import UpdateLessonPositionDto from '../../domain/application-service/features/update-lesson-position/dto/UpdateLessonPositionDto';
import { FastifyRequest } from 'fastify';
import LessonWrapperResponse from './response/LessonWrapperResponse';
import LessonsWrapperResponse from './response/LessonsWrapperResponse';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import PaginationDto from '../../../../common/common-domain/PaginationDto';

@Injectable()
@Controller('api/v1')
@ApiTags('Lesson')
export default class LessonController {
  constructor(
    private readonly createLessonCommandHandler: CreateLessonCommandHandler,
    private readonly getLessonsQueryHandler: GetLessonsQueryHandler,
    private readonly getLessonQueryHandler: GetLessonQueryHandler,
    private readonly updateLessonCommandHandler: UpdateLessonCommandHandler,
    private readonly updateLessonPositionCommandHandler: UpdateLessonPositionCommandHandler,
    private readonly deleteLessonCommandHandler: DeleteLessonCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('courses/:courseId/lessons')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a lesson' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lesson created',
    type: LessonWrapperResponse,
  })
  public async createLesson(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() request: FastifyRequest,
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<LessonWrapperResponse> {
    return new LessonWrapperResponse(
      await this.createLessonCommandHandler.execute({
        executor: request.executor,
        courseId,
        ...createLessonDto,
      }),
    );
  }

  @Get('courses/:courseId/lessons')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lessons' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lessons found',
    type: LessonsWrapperResponse,
  })
  public async getLessons(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Query(new ValidationPipe({ transform: true }))
    getLessonsDto: PaginationDto,
  ): Promise<LessonsWrapperResponse> {
    return new LessonsWrapperResponse(
      await this.getLessonsQueryHandler.execute({
        courseId,
        ...getLessonsDto,
      }),
    );
  }

  @Get('courses/:courseId/lessons/:lessonId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a lesson' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson found',
    type: LessonWrapperResponse,
  })
  public async getLesson(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ): Promise<LessonWrapperResponse> {
    return new LessonWrapperResponse(
      await this.getLessonQueryHandler.execute({
        lessonId,
        courseId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('courses/:courseId/lessons/:lessonId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson updated',
    type: LessonWrapperResponse,
  })
  public async updateLesson(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Req() request: FastifyRequest,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonWrapperResponse> {
    return new LessonWrapperResponse(
      await this.updateLessonCommandHandler.execute({
        executor: request.executor,
        lessonId,
        courseId,
        ...updateLessonDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('courses/:courseId/lessons/:lessonId/position')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a lesson position' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson position updated',
  })
  public async updateLessonPosition(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Req() request: FastifyRequest,
    @Body() updateLessonPositionDto: UpdateLessonPositionDto,
  ): Promise<void> {
    await this.updateLessonPositionCommandHandler.execute({
      executor: request.executor,
      lessonId,
      courseId,
      ...updateLessonPositionDto,
    });
  }

  @UseGuards(AuthenticationGuard)
  @Delete('courses/:courseId/lessons/:lessonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a lesson' })
  public async deleteLesson(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteLessonCommandHandler.execute({
      executor: request.executor,
      lessonId,
      courseId,
    });
  }
}
