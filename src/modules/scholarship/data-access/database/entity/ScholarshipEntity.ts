import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';
import ToSet from '../../../../../common/common-domain/decorator/ToSet';

export default class ScholarshipEntity {
  @Expose()
  public scholarshipId: number;

  @Expose()
  public image: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public provider: string;

  @Expose()
  @ToISO()
  public deadline: string;

  @Expose()
  public reference: string;

  @Expose()
  @ToSet()
  public categories: Set<string>;

  @Expose()
  @ToISO()
  public createdAt: Date;

  @Expose()
  @ToISO()
  public updatedAt: Date;
}
