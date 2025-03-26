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
import { UUID } from 'node:crypto';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import CreateUserAssignmentCommandHandler from '../../domain/application-service/features/create-assignment/CreateUserAssignmentCommandHandler';
import GetUserAssignmentsQueryHandler from '../../domain/application-service/features/get-assignments/GetUserAssignmentsQueryHandler';
import GetUserAssignmentQueryHandler from '../../domain/application-service/features/get-assignment/GetUserAssignmentQueryHandler';
import UpdateUserAssignmentCommandHandler from '../../domain/application-service/features/update-assignment/UpdateUserAssignmentCommandHandler';
import DeleteUserAssignmentCommandHandler from '../../domain/application-service/features/delete-assignment/DeleteUserAssignmentCommandHandler';
import CreateUserAssignmentDto from '../../domain/application-service/features/create-assignment/dto/CreateUserAssignmentDto';
import UpdateUserAssignmentDto from '../../domain/application-service/features/update-assignment/dto/UpdateUserAssignmentDto';
import UserAssignmentWrapperResponse from './response/UserAssignmentWrapperResponse';
import UserAssignmentsWrapperResponse from './response/UserAssignmentsWrapperResponse';

@Injectable()
@Controller('api/v1')
@ApiTags('UserAssignment')
export default class UserAssignmentController {
  constructor(
    private readonly createUserAssignmentCommandHandler: CreateUserAssignmentCommandHandler,
    private readonly getUserAssignmentsQueryHandler: GetUserAssignmentsQueryHandler,
    private readonly getUserAssignmentQueryHandler: GetUserAssignmentQueryHandler,
    private readonly updateUserAssignmentCommandHandler: UpdateUserAssignmentCommandHandler,
    private readonly deleteUserAssignmentCommandHandler: DeleteUserAssignmentCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('user-assignments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a user assignment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User assignment created successfully.',
    type: UserAssignmentWrapperResponse,
  })
  public async createUserAssignment(
    @Req() request: FastifyRequest,
    @Body() createUserAssignmentDto: CreateUserAssignmentDto,
  ): Promise<UserAssignmentWrapperResponse> {
    return new UserAssignmentWrapperResponse(
      await this.createUserAssignmentCommandHandler.execute({
        executor: request.executor,
        ...createUserAssignmentDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('user-assignments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user assignments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User assignments retrieved successfully',
    type: UserAssignmentsWrapperResponse,
  })
  public async getUserAssignments(
    @Query() query: PaginationDto,
    @Req() request: FastifyRequest,
  ): Promise<UserAssignmentsWrapperResponse> {
    return new UserAssignmentsWrapperResponse(
      await this.getUserAssignmentsQueryHandler.execute({
        executor: request.executor,
        ...query,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('user-assignments/:assignmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific user assignment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User assignment retrieved successfully',
    type: UserAssignmentWrapperResponse,
  })
  public async getUserAssignment(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Req() request: FastifyRequest,
  ): Promise<UserAssignmentWrapperResponse> {
    return new UserAssignmentWrapperResponse(
      await this.getUserAssignmentQueryHandler.execute({
        executor: request.executor,
        assignmentId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('user-assignments/:assignmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user assignment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User assignment updated successfully',
    type: UserAssignmentWrapperResponse,
  })
  public async updateUserAssignment(
    @Param('assignmentId', ParseIntPipe) assignmentId: UUID,
    @Req() request: FastifyRequest,
    @Body() updateUserAssignmentDto: UpdateUserAssignmentDto,
  ): Promise<UserAssignmentWrapperResponse> {
    return new UserAssignmentWrapperResponse(
      await this.updateUserAssignmentCommandHandler.execute({
        executor: request.executor,
        id: assignmentId,
        ...updateUserAssignmentDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('user-assignments/:assignmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user assignment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User assignment deleted successfully',
  })
  public async deleteUserAssignment(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteUserAssignmentCommandHandler.execute({
      executor: request.executor,
      assignmentId,
    });
  }
}
