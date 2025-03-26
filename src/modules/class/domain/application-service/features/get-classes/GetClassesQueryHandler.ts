import { Inject, Injectable } from '@nestjs/common';
import { ClassRepository } from '../../ports/output/repository/ClassRepository';
import ClassResponse from '../common/ClassResponse';
import GetClassesQuery from './dto/GetClassesQuery';
import Class from '../../../domain-core/entity/Class';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class GetClassesQueryHandler {
  constructor(
    @Inject(DependencyInjection.CLASS_REPOSITORY)
    private readonly classRepository: ClassRepository,
  ) {}

  public async execute(
    getClassesQuery: GetClassesQuery,
  ): Promise<ClassResponse[]> {
    const classes: Class[] = await this.classRepository.findMany({
      ...getClassesQuery,
      pagination: strictPlainToClass(Pagination, getClassesQuery),
    });
    return classes.map((courseClass) =>
      strictPlainToClass(ClassResponse, courseClass),
    );
  }
}
