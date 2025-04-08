import { Inject, Injectable } from '@nestjs/common';
import CreateTagCommand from './dto/CreateTagCommand';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import TagResponse from '../common/TagResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import TagTitleAlreadyExistsException from '../../../domain-core/exception/TagTitleAlreadyExistsException';
import Tag from '../../../domain-core/entity/Tag';

@Injectable()
export default class CreateTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(
    createTagCommand: CreateTagCommand,
  ): Promise<TagResponse> {
    await this.authorizationService.authorizeManageScholarship(
      createTagCommand.executor,
    );
    const tag: Tag = strictPlainToClass(Tag, createTagCommand);
    tag.create();
    await this.tagRepository.saveIfNotExistsOrThrow({
      tag,
      domainException: new TagTitleAlreadyExistsException(),
    });
    return strictPlainToClass(TagResponse, tag);
  }
}
