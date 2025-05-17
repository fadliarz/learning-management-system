import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import NotificationsWrapperResponse from './response/NotificationsWrapperResponse';
import { FastifyRequest } from 'fastify';
import GetNotificationsQueryHandler from '../../domain/application-service/features/get-notifications/GetNotificationsQueryHandler';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';

@Injectable()
@Controller('api/v1/notifications')
@ApiTags('Notification')
export default class NotificationController {
  constructor(
    private readonly getNotificationsQueryHandler: GetNotificationsQueryHandler,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notifications retrieved successfully',
    type: NotificationsWrapperResponse,
  })
  public async getNotifications(
    @Query() query: PaginationDto,
    @Req() request: FastifyRequest,
  ): Promise<NotificationsWrapperResponse> {
    return new NotificationsWrapperResponse(
      await this.getNotificationsQueryHandler.execute({
        executor: request.executor,
        ...query,
      }),
    );
  }
}
