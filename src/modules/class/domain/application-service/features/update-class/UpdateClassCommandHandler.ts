import { Inject, Injectable } from '@nestjs/common';
import UpdateClassCommand from './dto/UpdateClassCommand';
import { ClassRepository } from '../../ports/output/repository/ClassRepository';
import Class from '../../../domain-core/entity/Class';
import { plainToClass } from 'class-transformer';
import ClassResponse from '../common/ClassResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateClassCommandHandler {
  constructor(
    @Inject(DependencyInjection.CLASS_REPOSITORY)
    private readonly classRepository: ClassRepository,
  ) {}

  public async execute(
    updateClassCommand: UpdateClassCommand,
  ): Promise<ClassResponse> {
    const courseClass: Class = plainToClass(Class, updateClassCommand, {
      excludeExtraneousValues: true,
    });
    courseClass.update();
    await this.classRepository.saveIfExistsOrThrow({
      courseClass,
    });
    return plainToClass(ClassResponse, courseClass, {
      excludeExtraneousValues: true,
    });
  }
}
