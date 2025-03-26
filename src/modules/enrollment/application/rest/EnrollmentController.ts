import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import CreateEnrollmentCommandHandler from '../../domain/application-service/features/create-enrollment/CreateEnrollmentCommandHandler';
import DeleteEnrollmentCommandHandler from '../../domain/application-service/features/delete-enrollment/DeleteEnrollmentCommandHandler';
import EnrollmentWrapperResponse from './response/EnrollmentWrapperResponse';

@Injectable()
@Controller('api/v1')
@ApiTags('Enrollment')
export default class EnrollmentController {
  constructor(
    private readonly createEnrollmentCommandHandler: CreateEnrollmentCommandHandler,
    private readonly deleteEnrollmentCommandHandler: DeleteEnrollmentCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('courses/:courseId/classes/:classId/enrollments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an enrollment for a course' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Enrollment created successfully.',
    type: EnrollmentWrapperResponse,
  })
  public async createEnrollment(
    @Req() request: FastifyRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
  ): Promise<EnrollmentWrapperResponse> {
    return new EnrollmentWrapperResponse(
      await this.createEnrollmentCommandHandler.execute({
        executor: request.executor,
        courseId,
        classId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('courses/:courseId/classes/:classId/enrollments')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an enrollment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Enrollment deleted successfully',
  })
  public async deleteEnrollment(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteEnrollmentCommandHandler.execute({
      executor: request.executor,
      courseId,
      classId,
    });
  }
}
