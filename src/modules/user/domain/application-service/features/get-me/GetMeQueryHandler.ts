import { Inject, Injectable } from '@nestjs/common';
import UserRepository from '../../ports/output/repository/UserRepository';
import GetMeQuery from './dto/GetMeQuery';
import UserResponse from '../common/UserResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetMeQueryHandler {
  constructor(
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(getMeQuery: GetMeQuery): Promise<UserResponse> {
    return strictPlainToClass(UserResponse, getMeQuery.executor);
  }
}
