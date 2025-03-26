import User from '../../../../../../user/domain/domain-core/entity/User';
import ResponseItem from '../../../../domain-core/entity/ResponseItem';

export default class CreateFormSubmissionCommand {
  public executor: User;
  public formId: string;
  public responseItems: ResponseItem[];
}
