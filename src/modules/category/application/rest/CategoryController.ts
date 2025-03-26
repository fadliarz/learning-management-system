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
import CreateCategoryCommandHandler from '../../domain/application-service/features/create-category/CreateCategoryCommandHandler';
import GetCategoriesQueryHandler from '../../domain/application-service/features/get-categories/GetCategoriesQueryHandler';
import GetCategoryQueryHandler from '../../domain/application-service/features/get-category/GetCategoryQueryHandler';
import UpdateCategoryCommandHandler from '../../domain/application-service/features/update-category/UpdateCategoryCommandHandler';
import DeleteCategoryCommandHandler from '../../domain/application-service/features/delete-category/DeleteCategoryCommandHandler';
import UpdateCategoryDto from '../../domain/application-service/features/update-category/dto/UpdateCategoryDto';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import { FastifyRequest } from 'fastify';
import CreateCategoryDto from '../../domain/application-service/features/create-category/dto/CreateCategoryDto';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import CategoryWrapperResponse from './response/CategoryWrapperResponse';
import CategoriesWrapperResponse from './response/CategoriesWrapperResponse';

@Injectable()
@Controller('api/v1/categories')
@ApiTags('Category')
export default class CategoryController {
  constructor(
    private readonly createCategoryCommandHandler: CreateCategoryCommandHandler,
    private readonly getCategoriesQueryHandler: GetCategoriesQueryHandler,
    private readonly getCategoryQueryHandler: GetCategoryQueryHandler,
    private readonly updateCategoryCommandHandler: UpdateCategoryCommandHandler,
    private readonly deleteCategoryCommandHandler: DeleteCategoryCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully.',
    type: CategoryWrapperResponse,
  })
  public async createCategory(
    @Req() request: FastifyRequest,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryWrapperResponse> {
    return new CategoryWrapperResponse(
      await this.createCategoryCommandHandler.execute({
        executor: request.executor,
        ...createCategoryDto,
      }),
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
    type: CategoriesWrapperResponse,
  })
  public async getCategories(
    @Query() query: PaginationDto,
  ): Promise<CategoriesWrapperResponse> {
    return new CategoriesWrapperResponse(
      await this.getCategoriesQueryHandler.execute(query),
    );
  }

  @Get(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
    type: CategoryWrapperResponse,
  })
  public async getCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryWrapperResponse> {
    return new CategoryWrapperResponse(
      await this.getCategoryQueryHandler.execute({
        categoryId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
    type: CategoryWrapperResponse,
  })
  public async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Req() request: FastifyRequest,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryWrapperResponse> {
    return new CategoryWrapperResponse(
      await this.updateCategoryCommandHandler.execute({
        executor: request.executor,
        categoryId,
        ...updateCategoryDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted successfully',
  })
  public async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteCategoryCommandHandler.execute({
      executor: request.executor,
      categoryId,
    });
  }
}
