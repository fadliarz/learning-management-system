import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateScholarshipCommand {
  public executor: User;
  public scholarshipId: number;
  public image: string;
  public title: string;
  public description: string;
  public provider: string;
  public deadline: string;
  public reference: string;
}
