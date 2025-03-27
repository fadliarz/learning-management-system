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
import CreateAttachmentCommandHandler from '../../domain/application-service/features/create-attachment/CreateAttachmentCommandHandler';
import GetAttachmentsQueryHandler from '../../domain/application-service/features/get-attachments/GetAttachmentsQueryHandler';
import GetAttachmentQueryHandler from '../../domain/application-service/features/get-attachment/GetAttachmentQueryHandler';
import UpdateAttachmentCommandHandler from '../../domain/application-service/features/update-attachment/UpdateAttachmentCommandHandler';
import DeleteAttachmentCommandHandler from '../../domain/application-service/features/delete-attachment/DeleteAttachmentCommandHandler';
import CreateAttachmentDto from '../../domain/application-service/features/create-attachment/dto/CreateAttachmentDto';
import UpdateAttachmentDto from '../../domain/application-service/features/update-attachment/dto/UpdateAttachmentDto';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import { FastifyRequest } from 'fastify';
import AttachmentsWrapperResponse from './response/AttachmentsWrapperResponse';
import AttachmentWrapperResponse from './response/AttachmentWrapperResponse';

@Injectable()
@Controller('api/v1/')
@ApiTags('Attachment')
export default class AttachmentController {
  constructor(
    private readonly createAttachmentCommandHandler: CreateAttachmentCommandHandler,
    private readonly getAttachmentsQueryHandler: GetAttachmentsQueryHandler,
    private readonly getAttachmentQueryHandler: GetAttachmentQueryHandler,
    private readonly updateAttachmentCommandHandler: UpdateAttachmentCommandHandler,
    private readonly deleteAttachmentCommandHandler: DeleteAttachmentCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('courses/:courseId/lessons/:lessonId/attachments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an attachment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attachment created successfully.',
    type: AttachmentWrapperResponse,
  })
  public async createAttachment(
    @Req() request: FastifyRequest,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() createAttachmentDto: CreateAttachmentDto,
  ): Promise<AttachmentWrapperResponse> {
    return new AttachmentWrapperResponse(
      await this.createAttachmentCommandHandler.execute({
        executor: request.executor,
        courseId,
        lessonId,
        ...createAttachmentDto,
      }),
    );
  }

  @Get('courses/:courseId/lessons/:lessonId/attachments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get attachments for a lesson' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attachments retrieved successfully',
    type: AttachmentsWrapperResponse,
  })
  public async getAttachments(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Query() query: PaginationDto,
  ): Promise<AttachmentsWrapperResponse> {
    return new AttachmentsWrapperResponse(
      await this.getAttachmentsQueryHandler.execute({
        lessonId,
        ...query,
      }),
    );
  }

  @Get('courses/:courseId/lessons/:lessonId/attachments/:attachmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific attachment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attachment retrieved successfully',
    type: AttachmentWrapperResponse,
  })
  public async getAttachment(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
  ): Promise<AttachmentWrapperResponse> {
    return new AttachmentWrapperResponse(
      await this.getAttachmentQueryHandler.execute({
        attachmentId,
        lessonId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('courses/:courseId/lessons/:lessonId/attachments/:attachmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an attachment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attachment updated successfully',
    type: AttachmentWrapperResponse,
  })
  public async updateAttachment(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
    @Req() request: FastifyRequest,
    @Body() updateAttachmentDto: UpdateAttachmentDto,
  ): Promise<AttachmentWrapperResponse> {
    return new AttachmentWrapperResponse(
      await this.updateAttachmentCommandHandler.execute({
        executor: request.executor,
        attachmentId,
        lessonId,
        ...updateAttachmentDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('courses/:courseId/lessons/:lessonId/attachments/:attachmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attachment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Attachment deleted successfully',
  })
  public async deleteAttachment(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteAttachmentCommandHandler.execute({
      executor: request.executor,
      attachmentId,
      courseId,
      lessonId,
    });
  }
}
