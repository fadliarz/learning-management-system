import {
  Body,
  Controller,
  Delete,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import CreatePrivilegeCommandHandler from '../../domain/application-service/features/create-privilege/CreatePrivilegeCommandHandler';
import DeletePrivilegeCommandHandler from '../../domain/application-service/features/delete-privilege/DeletePrivilegeCommandHandler';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import { FastifyRequest } from 'fastify';
import CreatePrivilegeDto from '../../domain/application-service/features/create-privilege/dto/CreatePrivilegeDto';
import { Permission } from '../../domain/domain-core/entity/Permission';

@ApiTags('Privilege')
@Controller('api/v1')
export default class PrivilegeController {
  constructor(
    private readonly createPrivilegeCommandHandler: CreatePrivilegeCommandHandler,
    private readonly deletePrivilegeCommandHandler: DeletePrivilegeCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @ApiOperation({
    summary: 'Create a privilege for a user',
    description: 'Assigns a specific permission to a user',
  })
  @Post('privileges')
  public async createPrivilege(
    @Req() request: FastifyRequest,
    @Body() createPrivilegeDto: CreatePrivilegeDto,
  ): Promise<void> {
    await this.createPrivilegeCommandHandler.execute({
      executor: request.executor,
      ...createPrivilegeDto,
    });
  }

  @UseGuards(AuthenticationGuard)
  @ApiOperation({
    summary: "Delete a user's privilege",
    description: 'Removes a specific permission from a user',
  })
  @ApiParam({ name: 'permission', enum: Permission })
  @Delete('privileges/users/:userId/permissions/:permission')
  public async deletePrivilege(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('permission', new ParseEnumPipe(Permission))
    permission: Permission,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deletePrivilegeCommandHandler.execute({
      executor: request.executor,
      userId,
      permission,
    });
  }
}
