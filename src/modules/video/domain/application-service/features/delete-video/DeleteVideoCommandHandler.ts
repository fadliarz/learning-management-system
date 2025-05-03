import { Inject, Injectable } from '@nestjs/common';
import DeleteVideoCommand from './dto/DeleteVideoCommand';
import { VideoRepository } from '../../ports/output/repository/VideoRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteVideoCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.VIDEO_REPOSITORY)
    private readonly videoRepository: VideoRepository,
  ) {}

  public async execute(deleteVideoCommand: DeleteVideoCommand): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      deleteVideoCommand.executor,
    );
    await this.videoRepository.deleteIfExistsOrThrow({
      ...deleteVideoCommand,
    });
  }
}
