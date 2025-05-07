import { TagRepository } from '../../ports/output/repository/TagRepository';
import { Inject, Injectable } from '@nestjs/common';
import UpdateTagCommand from './dto/UpdateTagCommand';
import TagResponse from '../common/TagResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Tag from '../../../domain-core/entity/Tag';

@Injectable()
export default class UpdateTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(
    updateTagCommand: UpdateTagCommand,
  ): Promise<TagResponse> {
    await this.authorizationService.authorizeManageScholarship(
      updateTagCommand.executor,
    );
    const tag: Tag = strictPlainToClass(Tag, updateTagCommand);
    await this.tagRepository.saveIfExistsOrThrow({
      tag,
    });
    return strictPlainToClass(TagResponse, tag);
  }
}
