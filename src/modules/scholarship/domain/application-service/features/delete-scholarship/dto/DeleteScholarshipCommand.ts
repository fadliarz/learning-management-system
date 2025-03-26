import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteScholarshipCommand {
  public executor: User;
  public scholarshipId: number;
}
