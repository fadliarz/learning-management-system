import User from '../../../../domain-core/entity/User';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';

export default interface UserRepository {
  saveIfEmailNotTakenOrThrow(param: {
    user: User;
    domainException: DomainException;
  }): Promise<void>;

  findByIdOrThrow(param: {
    userId: number;
    domainException: DomainException;
  }): Promise<User>;

  findByEmailOrThrow(param: {
    email: string;
    domainException: DomainException;
  }): Promise<User>;

  saveIfExistsOrThrow(param: {
    user: User;
    domainException: DomainException;
  }): Promise<void>;
}
