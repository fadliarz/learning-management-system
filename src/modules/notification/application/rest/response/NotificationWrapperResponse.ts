import { ApiProperty } from '@nestjs/swagger';
import NotificationResponse from '../../../domain/application-service/features/common/NotificationResponse';

export default class NotificationWrapperResponse {
  @ApiProperty({ type: NotificationResponse })
  public data: NotificationResponse;

  constructor(data: NotificationResponse) {
    this.data = data;
  }
}
