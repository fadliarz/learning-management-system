import User from '../../../../domain-core/entity/User';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default interface UserRepository {
  saveIfEmailNotTakenOrThrow(param: { user: User }): Promise<void>;

  findMany(param: { pagination: Pagination }): Promise<User[]>;

  findByIdOrThrow(param: {
    userId: number;
    domainException?: DomainException;
  }): Promise<User>;

  findByEmailOrThrow(param: {
    email: string;
    domainException?: DomainException;
  }): Promise<User>;

  saveIfExistsOrThrow(param: {
    user: User;
    domainException?: DomainException;
  }): Promise<void>;
}
