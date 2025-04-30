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
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import CreateClassAssignmentCommandHandler from '../../domain/application-service/features/create-assignment/CreateClassAssignmentCommandHandler';
import GetClassAssignmentsQueryHandler from '../../domain/application-service/features/get-assignments/GetClassAssignmentsQueryHandler';
import GetClassAssignmentQueryHandler from '../../domain/application-service/features/get-assignment/GetClassAssignmentQueryHandler';
import CreateClassAssignmentDto from '../../domain/application-service/features/create-assignment/dto/CreateClassAssignmentDto';
import UpdateClassAssignmentDto from '../../domain/application-service/features/update-assignment/dto/UpdateClassAssignmentDto';
import UpdateClassAssignmentCommandHandler from '../../domain/application-service/features/update-assignment/UpdateClassAssignmentCommandHandler';
import DeleteClassAssignmentCommandHandler from '../../domain/application-service/features/delete-assignment/DeleteClassAssignmentCommandHandler';
import ClassAssignmentWrapperResponse from './response/ClassAssignmentWrapperResponse';
import ClassesAssignmentWrapperResponse from './response/ClassesAssignmentWrapperResponse';

@Injectable()
@Controller('api/v1')
@ApiTags('ClassAssignment')
export default class ClassAssignmentController {
  constructor(
    private readonly createClassAssignmentCommandHandler: CreateClassAssignmentCommandHandler,
    private readonly getClassAssignmentsQueryHandler: GetClassAssignmentsQueryHandler,
    private readonly getClassAssignmentQueryHandler: GetClassAssignmentQueryHandler,
    private readonly updateClassAssignmentCommandHandler: UpdateClassAssignmentCommandHandler,
    private readonly deleteClassAssignmentCommandHandler: DeleteClassAssignmentCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('courses/:courseId/classes/:classId/assignments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an assignment for a class' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Assignment created successfully.',
    type: ClassAssignmentWrapperResponse,
  })
  public async createClassAssignment(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Req() request: FastifyRequest,
    @Body() createClassAssignmentDto: CreateClassAssignmentDto,
  ): Promise<ClassAssignmentWrapperResponse> {
    return new ClassAssignmentWrapperResponse(
      await this.createClassAssignmentCommandHandler.execute({
        executor: request.executor,
        courseId,
        classId,
        ...createClassAssignmentDto,
      }),
    );
  }

  @Get('courses/:courseId/classes/:classId/assignments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all assignments for a class' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assignments retrieved successfully',
    type: ClassesAssignmentWrapperResponse,
  })
  public async getClassAssignments(
    @Param('classId', ParseIntPipe) classId: number,
    @Query() query: PaginationDto,
  ): Promise<ClassesAssignmentWrapperResponse> {
    return new ClassesAssignmentWrapperResponse(
      await this.getClassAssignmentsQueryHandler.execute({
        classId,
        ...query,
      }),
    );
  }

  @Get('courses/:courseId/classes/:classId/assignments/:assignmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific assignment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assignment retrieved successfully',
    type: ClassAssignmentWrapperResponse,
  })
  public async getClassAssignment(
    @Param('classId', ParseIntPipe) classId: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<ClassAssignmentWrapperResponse> {
    return new ClassAssignmentWrapperResponse(
      await this.getClassAssignmentQueryHandler.execute({
        assignmentId,
        classId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('courses/:courseId/classes/:classId/assignments/:assignmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assignment updated successfully',
    type: ClassAssignmentWrapperResponse,
  })
  public async updateClassAssignment(
    @Param('classId', ParseIntPipe) classId: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Req() request: FastifyRequest,
    @Body() updateClassAssignmentDto: UpdateClassAssignmentDto,
  ): Promise<ClassAssignmentWrapperResponse> {
    return new ClassAssignmentWrapperResponse(
      await this.updateClassAssignmentCommandHandler.execute({
        executor: request.executor,
        assignmentId,
        classId,
        ...updateClassAssignmentDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('courses/:courseId/classes/:classId/assignments/:assignmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Assignment deleted successfully',
  })
  public async deleteClassAssignment(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteClassAssignmentCommandHandler.execute({
      executor: request.executor,
      assignmentId,
      courseId,
      classId,
    });
  }
}
