import { Expose } from 'class-transformer';
import Serialize from '../../../../../common/common-domain/decorator/Serialize';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';

export default class FormSubmissionEntity {
  @Expose()
  public formId: string;

  @Expose()
  public submissionId: number;

  @Expose()
  public userId: number;

  @Expose()
  @Serialize()
  public responseItems: string;

  @Expose()
  @ToISO()
  public createdAt: string;
}
