import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateScholarshipCommand {
  public executor: User;
  public image: string;
  public title: string;
  public description: string;
  public provider: string;
  public deadline: string;
  public reference: string;
  public categories: string[];
}
