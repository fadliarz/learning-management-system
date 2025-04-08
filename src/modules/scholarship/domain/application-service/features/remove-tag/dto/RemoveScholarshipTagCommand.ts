import User from '../../../../../../user/domain/domain-core/entity/User';

export default class RemoveScholarshipTagCommand {
  public executor: User;
  public scholarshipId: number;
  public tagId: number;
}
