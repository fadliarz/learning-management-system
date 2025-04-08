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
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import { FastifyRequest } from 'fastify';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import TagWrapperResponse from './response/TagWrapperResponse';
import TagsWrapperResponse from './response/TagsWrapperResponse';
import CreateTagCommandHandler from '../../domain/application-service/features/create-tag/CreateTagCommandHandler';
import GetTagsQueryHandler from '../../domain/application-service/features/get-tags/GetTagsQueryHandler';
import GetTagQueryHandler from '../../domain/application-service/features/get-tag/GetTagQueryHandler';
import UpdateTagCommandHandler from '../../domain/application-service/features/update-tag/UpdateTagCommandHandler';
import DeleteTagCommandHandler from '../../domain/application-service/features/delete-tag/DeleteTagCommandHandler';
import CreateTagDto from '../../domain/application-service/features/create-tag/dto/CreateTagDto';
import UpdateTagDto from '../../domain/application-service/features/update-tag/dto/UpdateTagDto';

@Injectable()
@Controller('api/v1/tags')
@ApiTags('Tag')
export default class TagController {
  constructor(
    private readonly createTagCommandHandler: CreateTagCommandHandler,
    private readonly getTagsQueryHandler: GetTagsQueryHandler,
    private readonly getTagQueryHandler: GetTagQueryHandler,
    private readonly updateTagCommandHandler: UpdateTagCommandHandler,
    private readonly deleteTagCommandHandler: DeleteTagCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tag created successfully.',
    type: TagWrapperResponse,
  })
  public async createTag(
    @Req() request: FastifyRequest,
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagWrapperResponse> {
    return new TagWrapperResponse(
      await this.createTagCommandHandler.execute({
        executor: request.executor,
        ...createTagDto,
      }),
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tags retrieved successfully',
    type: TagsWrapperResponse,
  })
  public async getTags(
    @Query() query: PaginationDto,
  ): Promise<TagsWrapperResponse> {
    return new TagsWrapperResponse(
      await this.getTagsQueryHandler.execute(query),
    );
  }

  @Get(':tagId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific tag' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tag retrieved successfully',
    type: TagWrapperResponse,
  })
  public async getTag(
    @Param('tagId', ParseIntPipe) tagId: number,
  ): Promise<TagWrapperResponse> {
    return new TagWrapperResponse(
      await this.getTagQueryHandler.execute({
        tagId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':tagIId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tag updated successfully',
    type: TagWrapperResponse,
  })
  public async updateTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Req() request: FastifyRequest,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagWrapperResponse> {
    return new TagWrapperResponse(
      await this.updateTagCommandHandler.execute({
        executor: request.executor,
        tagId,
        ...updateTagDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':tagId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Tag deleted successfully',
  })
  public async deleteTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteTagCommandHandler.execute({
      executor: request.executor,
      tagId,
    });
  }
}
