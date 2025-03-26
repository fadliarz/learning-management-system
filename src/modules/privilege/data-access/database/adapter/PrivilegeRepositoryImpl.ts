import { Injectable } from '@nestjs/common';
import { Permission } from '../../../domain/domain-core/entity/Permission';
import Privilege from '../../../domain/domain-core/entity/Privilege';
import PrivilegeDynamoDBRepository from '../repository/PrivilegeDynamoDBRepository';
import PrivilegeRepository from '../../../domain/application-service/ports/output/PrivilegeRepository';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import PrivilegeEntity from '../entity/PrivilegeEntity';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';

@Injectable()
export default class PrivilegeRepositoryImpl implements PrivilegeRepository {
  constructor(
    private readonly privilegeDynamoDBRepository: PrivilegeDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrIgnore(param: {
    privilege: Privilege;
  }): Promise<void> {
    await this.privilegeDynamoDBRepository.saveIfNotExistsOrIgnore({
      privilegeEntity: strictPlainToClass(PrivilegeEntity, param.privilege),
    });
  }

  public async findByIdOrThrow(param: {
    userId: number;
    permission: Permission;
    domainException: DomainException;
  }): Promise<void> {
    await this.privilegeDynamoDBRepository.findByIdOrThrow(param);
  }

  public async findMany(param: { userId: number }): Promise<Privilege[]> {
    const privilegeEntities: PrivilegeEntity[] =
      await this.privilegeDynamoDBRepository.findMany(param);
    return privilegeEntities.map((privilegeEntity) =>
      strictPlainToClass(Privilege, privilegeEntity),
    );
  }

  public async deleteIfExistsOrIgnore(param: {
    userId: number;
    permission: Permission;
  }): Promise<void> {
    await this.privilegeDynamoDBRepository.deleteIfExistsOrIgnore(param);
  }
}
