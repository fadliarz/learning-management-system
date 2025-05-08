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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import CreateClassCommandHandler from '../../domain/application-service/features/create-class/CreateClassCommandHandler';
import CreateClassDto from '../../domain/application-service/features/create-class/dto/CreateClassDto';
import GetClassesQueryHandler from '../../domain/application-service/features/get-classes/GetClassesQueryHandler';
import GetClassQueryHandler from '../../domain/application-service/features/get-class/GetClassQueryHandler';
import UpdateClassCommandHandler from '../../domain/application-service/features/update-class/UpdateClassCommandHandler';
import UpdateClassDto from '../../domain/application-service/features/update-class/dto/UpdateClassDto';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import ClassesWrapperResponse from './response/ClassesWrapperResponse';
import ClassWrapperResponse from './response/ClassWrapperResponse';
import DeleteClassCommandHandler from '../../domain/application-service/features/delete-class/DeleteClassCommandHandler';

@Injectable()
@Controller('api/v1')
@ApiTags('Class')
export default class ClassController {
  constructor(
    private readonly createClassCommandHandler: CreateClassCommandHandler,
    private readonly getClassesQueryHandler: GetClassesQueryHandler,
    private readonly getClassQueryHandler: GetClassQueryHandler,
    private readonly updateClassCommandHandler: UpdateClassCommandHandler,
    private readonly deleteClassCommandHandler: DeleteClassCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('courses/:courseId/classes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a class for a course' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Class created successfully.',
    type: ClassWrapperResponse,
  })
  public async createClass(
    @Req() request: FastifyRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createClassDto: CreateClassDto,
  ): Promise<ClassWrapperResponse> {
    return new ClassWrapperResponse(
      await this.createClassCommandHandler.execute({
        executor: request.executor,
        courseId,
        ...createClassDto,
      }),
    );
  }

  @Get('courses/:courseId/classes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all classes for a course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Classes retrieved successfully',
    type: ClassesWrapperResponse,
  })
  public async getClasses(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Query() query: PaginationDto,
  ): Promise<ClassesWrapperResponse> {
    return new ClassesWrapperResponse(
      await this.getClassesQueryHandler.execute({
        courseId,
        ...query,
      }),
    );
  }

  @Get('courses/:courseId/classes/:classId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific class' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class retrieved successfully',
    type: ClassWrapperResponse,
  })
  public async getClass(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
  ): Promise<ClassWrapperResponse> {
    return new ClassWrapperResponse(
      await this.getClassQueryHandler.execute({
        classId,
        courseId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('courses/:courseId/classes/:classId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class updated successfully',
    type: ClassWrapperResponse,
  })
  public async updateClass(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Req() request: FastifyRequest,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassWrapperResponse> {
    return new ClassWrapperResponse(
      await this.updateClassCommandHandler.execute({
        executor: request.executor,
        classId,
        courseId,
        ...updateClassDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':courses/:courseId/classes/:classId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a class' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Class deleted successfully',
  })
  public async deleteClass(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteClassCommandHandler.execute({
      executor: request.executor,
      classId,
      courseId,
    });
  }
}
