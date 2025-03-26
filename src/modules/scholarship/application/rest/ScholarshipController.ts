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
import CreateScholarshipCommandHandler from '../../domain/application-service/features/create-scholarship/CreateScholarshipCommandHandler';
import CreateScholarshipDto from '../../domain/application-service/features/create-scholarship/dto/CreateScholarshipDto';
import GetScholarshipsQueryHandler from '../../domain/application-service/features/get-scholarships/GetScholarshipsQueryHandler';
import GetScholarshipQueryHandler from '../../domain/application-service/features/get-scholarship/GetScholarshipQueryHandler';
import UpdateScholarshipCommandHandler from '../../domain/application-service/features/update-scholarship/UpdateScholarshipCommandHandler';
import UpdateScholarshipDto from '../../domain/application-service/features/update-scholarship/dto/UpdateScholarshipDto';
import DeleteScholarshipCommandHandler from '../../domain/application-service/features/delete-scholarship/DeleteScholarshipCommandHandler';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import ScholarshipWrapperResponse from './response/ScholarshipWrapperResponse';
import ScholarshipsWrapperResponse from './response/ScholarshipsWrapperResponse';

@Injectable()
@Controller('api/v1')
@ApiTags('Scholarship')
export default class ScholarshipController {
  constructor(
    private readonly createScholarshipCommandHandler: CreateScholarshipCommandHandler,
    private readonly getScholarshipsQueryHandler: GetScholarshipsQueryHandler,
    private readonly getScholarshipQueryHandler: GetScholarshipQueryHandler,
    private readonly updateScholarshipCommandHandler: UpdateScholarshipCommandHandler,
    private readonly deleteScholarshipCommandHandler: DeleteScholarshipCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('scholarships')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a scholarship' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Scholarship created successfully.',
    type: ScholarshipWrapperResponse,
  })
  public async createScholarship(
    @Req() request: FastifyRequest,
    @Body() createScholarshipDto: CreateScholarshipDto,
  ): Promise<ScholarshipWrapperResponse> {
    return new ScholarshipWrapperResponse(
      await this.createScholarshipCommandHandler.execute({
        executor: request.executor,
        ...createScholarshipDto,
      }),
    );
  }

  @Get('scholarships')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all scholarships' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scholarships retrieved successfully',
    type: ScholarshipsWrapperResponse,
  })
  public async getScholarships(
    @Query() query: PaginationDto,
  ): Promise<ScholarshipsWrapperResponse> {
    return new ScholarshipsWrapperResponse(
      await this.getScholarshipsQueryHandler.execute({
        ...query,
      }),
    );
  }

  @Get('scholarships/:scholarshipId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific scholarship' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scholarship retrieved successfully',
    type: ScholarshipWrapperResponse,
  })
  public async getScholarship(
    @Param('scholarshipId', ParseIntPipe) scholarshipId: number,
  ): Promise<ScholarshipWrapperResponse> {
    return new ScholarshipWrapperResponse(
      await this.getScholarshipQueryHandler.execute({
        scholarshipId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('scholarships/:scholarshipId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a scholarship' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scholarship updated successfully',
    type: ScholarshipWrapperResponse,
  })
  public async updateScholarship(
    @Param('scholarshipId', ParseIntPipe) scholarshipId: number,
    @Req() request: FastifyRequest,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
  ): Promise<ScholarshipWrapperResponse> {
    return new ScholarshipWrapperResponse(
      await this.updateScholarshipCommandHandler.execute({
        executor: request.executor,
        scholarshipId,
        ...updateScholarshipDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('scholarships/:scholarshipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a scholarship' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Scholarship deleted successfully',
  })
  public async deleteScholarship(
    @Param('scholarshipId', ParseIntPipe) scholarshipId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteScholarshipCommandHandler.execute({
      executor: request.executor,
      scholarshipId,
    });
  }
}
