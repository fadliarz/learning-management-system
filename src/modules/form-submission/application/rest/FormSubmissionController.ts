import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import { FastifyRequest } from 'fastify';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import CreateFormSubmissionCommandHandler from '../../domain/application-service/features/create-submission/CreateFormSubmissionCommandHandler';
import GetFormSubmissionsQueryHandler from '../../domain/application-service/features/get-submissions/GetFormSubmissionsQueryHandler';
import CreateFormSubmissionDto from '../../domain/application-service/features/create-submission/dto/CreateFormSubmissionDto';
import FormSubmissionWrapperResponse from './response/FormSubmissionWrapperResponse';
import FormSubmissionsWrapperResponse from './response/FormSubmissionsWrapperResponse';

@Injectable()
@Controller('api/v1')
@ApiTags('Form Submission')
export default class FormSubmissionController {
  constructor(
    private readonly createFormSubmissionCommandHandler: CreateFormSubmissionCommandHandler,
    private readonly getFormSubmissionsQueryHandler: GetFormSubmissionsQueryHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('forms/:formId/submissions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a form response' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Form submitted successfully',
    type: FormSubmissionWrapperResponse,
  })
  public async createFormSubmission(
    @Param('formId') formId: string,
    @Req() request: FastifyRequest,
    @Body() createFormSubmissionDto: CreateFormSubmissionDto,
  ): Promise<FormSubmissionWrapperResponse> {
    return new FormSubmissionWrapperResponse(
      await this.createFormSubmissionCommandHandler.execute({
        executor: request.executor,
        formId,
        ...createFormSubmissionDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('forms/:formId/submissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all submissions for a specific form' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Form submissions retrieved successfully',
    type: FormSubmissionsWrapperResponse,
  })
  public async getFormSubmissions(
    @Param('formId') formId: string,
    @Query() query: PaginationDto,
    @Req() request: FastifyRequest,
  ): Promise<FormSubmissionsWrapperResponse> {
    return new FormSubmissionsWrapperResponse(
      await this.getFormSubmissionsQueryHandler.execute({
        executor: request.executor,
        formId,
        ...query,
      }),
    );
  }
}
