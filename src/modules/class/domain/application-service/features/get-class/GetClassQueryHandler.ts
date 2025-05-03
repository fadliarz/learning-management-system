import { Inject, Injectable } from '@nestjs/common';
import GetClassQuery from './dto/GetClassQuery';
import { ClassRepository } from '../../ports/output/repository/ClassRepository';
import ClassResponse from '../common/ClassResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetClassQueryHandler {
  constructor(
    @Inject(DependencyInjection.CLASS_REPOSITORY)
    private readonly classRepository: ClassRepository,
  ) {}

  public async execute(query: GetClassQuery): Promise<ClassResponse> {
    const courseClass = await this.classRepository.findByIdOrThrow({
      ...query,
    });
    return strictPlainToClass(ClassResponse, courseClass);
  }
}
