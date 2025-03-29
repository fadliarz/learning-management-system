import { Injectable } from '@nestjs/common';
import UserRepository from '../../../domain/application-service/ports/output/repository/UserRepository';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import User from '../../../domain/domain-core/entity/User';
import UserDynamoDBRepository from '../repository/UserDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import UserEntity from '../entity/UserEntity';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly userDynamoDBRepository: UserDynamoDBRepository,
  ) {}

  public async saveIfEmailNotTakenOrThrow(param: {
    user: User;
    domainException: DomainException;
  }): Promise<void> {
    await this.userDynamoDBRepository.saveIfEmailNotTakenOrThrow({
      ...param,
      userEntity: strictPlainToClass(UserEntity, param.user),
    });
  }

  public async findMany(param: { pagination: Pagination }): Promise<User[]> {
    const userEntities: UserEntity[] =
      await this.userDynamoDBRepository.findMany(param);
    return userEntities.map((userEntity) =>
      strictPlainToClass(User, userEntity),
    );
  }

  public async findByIdOrThrow(param: {
    userId: number;
    domainException: DomainException;
  }): Promise<User> {
    return strictPlainToClass(
      User,
      await this.userDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async findByEmailOrThrow(param: {
    email: string;
    domainException: DomainException;
  }): Promise<User> {
    const { userId } =
      await this.userDynamoDBRepository.findByEmailOrThrow(param);
    return strictPlainToClass(
      User,
      await this.userDynamoDBRepository.findByIdOrThrow({ ...param, userId }),
    );
  }

  public async saveIfExistsOrThrow(param: {
    user: User;
    domainException: DomainException;
  }): Promise<void> {
    await this.userDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      userEntity: strictPlainToClass(UserEntity, param.user),
    });
  }
}
