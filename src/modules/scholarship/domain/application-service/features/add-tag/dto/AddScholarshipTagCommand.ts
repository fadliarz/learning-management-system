import User from '../../../../../../user/domain/domain-core/entity/User';

export default class AddScholarshipTagCommand {
  public executor: User;
  public scholarshipId: number;
  public tagId: number;
}
