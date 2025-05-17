import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import PushObjectWrapperResponse from './response/PushObjectWrapperResponse';
import PushObjectsWrapperResponse from './response/PushObjectsWrapperResponse';
import CreatePushObjectCommandHandler from '../../domain/application-service/features/create-push-object/CreatePushObjectCommandHandler';
import GetPushObjectsQueryHandler from '../../domain/application-service/features/get-push-objects/GetPushObjectsQueryHandler';
import CreatePushObjectDto from '../../domain/application-service/features/create-push-object/dto/CreatePushObjectDto';

@Injectable()
@Controller('api/v1/push-objects')
@ApiTags('Push Object')
export default class PushObjectController {
  constructor(
    private readonly createPushObjectCommandHandler: CreatePushObjectCommandHandler,
    private readonly getPushObjectsQueryHandler: GetPushObjectsQueryHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a push object' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Push object created successfully',
    type: PushObjectWrapperResponse,
  })
  public async createPushObject(
    @Body() createPushObjectDto: CreatePushObjectDto,
  ): Promise<PushObjectWrapperResponse> {
    return new PushObjectWrapperResponse(
      await this.createPushObjectCommandHandler.execute(createPushObjectDto),
    );
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all push objects' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Push objects retrieved successfully',
    type: PushObjectsWrapperResponse,
  })
  public async getPushObjects(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PushObjectsWrapperResponse> {
    return new PushObjectsWrapperResponse(
      await this.getPushObjectsQueryHandler.execute({
        userId,
      }),
    );
  }
}
