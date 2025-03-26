import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';

export default class EnrollmentEntity {
  @Expose()
  public userId: number;

  @Expose()
  public courseId: number;

  @Expose()
  public classId: number;

  @Expose()
  @ToISO()
  public createdAt: string;
}
