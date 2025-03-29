import GetPublicUsersQuery from './dto/GetPublicUsersQuery';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import UserRepository from '../../../../../user/domain/application-service/ports/output/repository/UserRepository';
import User from '../../../../../user/domain/domain-core/entity/User';
import PublicUserResponse from '../common/PublicUserResponse';

export default class GetPublicUsersQueryHandler {
  constructor(
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    getPublicUsersQuery: GetPublicUsersQuery,
  ): Promise<PublicUserResponse[]> {
    const users: User[] = await this.userRepository.findMany({
      pagination: strictPlainToClass(Pagination, getPublicUsersQuery),
    });
    return users.map((user) => strictPlainToClass(PublicUserResponse, user));
  }
}
