export default class VideoKey {
  public lessonId: number;
  public videoId: number;

  constructor(param: { lessonId: number; videoId: number }) {
    this.lessonId = param.lessonId;
    this.videoId = param.videoId;
  }
}
