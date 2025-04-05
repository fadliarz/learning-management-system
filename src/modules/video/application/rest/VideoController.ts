import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import CreateVideoCommandHandler from '../../domain/application-service/features/create-video/CreateVideoCommandHandler';
import GetVideoQueryHandler from '../../domain/application-service/features/get-video/GetVideoQueryHandler';
import UpdateVideoCommandHandler from '../../domain/application-service/features/update-video/UpdateVideoCommandHandler';
import DeleteVideoCommandHandler from '../../domain/application-service/features/delete-video/DeleteVideoCommandHandler';
import CreateVideoDto from '../../domain/application-service/features/create-video/dto/CreateVideoDto';
import GetVideosQueryHandler from '../../domain/application-service/features/get-videos/GetVideosQueryHandler';
import VideoWrapperResponse from './response/VideoWrapperResponse';
import VideosWrapperResponse from './response/VideosWrapperResponse';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import UpdateVideoDto from '../../domain/application-service/features/update-video/dto/UpdateVideoDto';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';

@Controller('api/v1/courses')
@ApiTags('Video')
export default class VideoController {
  constructor(
    private readonly createVideoCommandHandler: CreateVideoCommandHandler,
    private readonly getVideosQueryHandler: GetVideosQueryHandler,
    private readonly getVideoQueryHandler: GetVideoQueryHandler,
    private readonly updateVideoCommandHandler: UpdateVideoCommandHandler,
    private readonly deleteVideoCommandHandler: DeleteVideoCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post(':courseId/lessons/:lessonId/videos')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a video' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Video created',
    type: VideoWrapperResponse,
  })
  public async createVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Req() request: FastifyRequest,
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<VideoWrapperResponse> {
    return new VideoWrapperResponse(
      await this.createVideoCommandHandler.execute({
        executor: request.executor,
        courseId,
        lessonId,
        ...createVideoDto,
      }),
    );
  }

  @Get(':courseId/lessons/:lessonId/videos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get videos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Videos found',
    type: VideosWrapperResponse,
  })
  public async getVideos(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Query() getVideosDto: PaginationDto,
  ): Promise<VideosWrapperResponse> {
    return new VideosWrapperResponse(
      await this.getVideosQueryHandler.execute({
        courseId,
        lessonId,
        ...getVideosDto,
      }),
    );
  }

  @Get(':courseId/lessons/:lessonId/videos/:videoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a video' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video found',
    type: VideoWrapperResponse,
  })
  public async getVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ): Promise<VideoWrapperResponse> {
    return new VideoWrapperResponse(
      await this.getVideoQueryHandler.execute({
        videoId,
        courseId,
        lessonId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':courseId/lessons/:lessonId/videos/:videoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a video' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video updated',
    type: VideoWrapperResponse,
  })
  public async updateVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
    @Req() request: FastifyRequest,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoWrapperResponse> {
    return new VideoWrapperResponse(
      await this.updateVideoCommandHandler.execute({
        executor: request.executor,
        videoId,
        courseId,
        lessonId,
        ...updateVideoDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':courseId/lessons/:lessonId/videos/:videoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a video' })
  public async deleteVideo(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteVideoCommandHandler.execute({
      executor: request.executor,
      videoId,
      courseId,
      lessonId,
    });
  }
}
