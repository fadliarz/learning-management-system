import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';

export default class CourseEntity {
  @Expose()
  public courseId: number;

  @Expose()
  public code: string;

  @Expose()
  public image: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public numberOfStudents: number;

  @Expose()
  public numberOfInstructors: number;

  @Expose()
  public numberOfClasses: number;

  @Expose()
  public numberOfAssignments: number;

  @Expose()
  public numberOfLessons: number;

  @Expose()
  public numberOfVideos: number;

  @Expose()
  public numberOfDurations: number;

  @Expose()
  public numberOfAttachments: number;

  @Expose()
  public categories: string[];

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: Date;

  @Expose()
  public version: number;

  @Expose()
  public lessonArrangementVersion: number;
}
