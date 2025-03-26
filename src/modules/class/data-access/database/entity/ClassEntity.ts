import ToISO from '../../../../../common/common-domain/decorator/ToISO';
import { Expose } from 'class-transformer';

export default class ClassEntity {
  @Expose()
  public classId: number;

  @Expose()
  public courseId: number;

  @Expose()
  public numberOfInstructors: number;

  @Expose()
  public numberOfAssignments: number;

  @Expose()
  public title: string;

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: string;
}
