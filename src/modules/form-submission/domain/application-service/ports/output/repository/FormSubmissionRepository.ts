import FormSubmission from '../../../../domain-core/entity/FormSubmission';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default interface FormSubmissionRepository {
  save(param: { formSubmission: FormSubmission }): Promise<void>;

  findMany(param: {
    formId: string;
    pagination: Pagination;
  }): Promise<FormSubmission[]>;
}
