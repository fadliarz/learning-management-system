import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default class GetVideosQuery extends Pagination {
  public courseId: number;
  public lessonId: number;
}
