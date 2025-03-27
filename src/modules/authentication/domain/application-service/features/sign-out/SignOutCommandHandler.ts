import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import { AuthenticationService } from '../../ports/output/service/AuthenticationService';
import SignOutCommand from './dto/SignOutCommand';

@Injectable()
export default class SignOutCommandHandler {
  constructor(
    @Inject(DependencyInjection.AUTHENTICATION_SERVICE)
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async execute(signOutCommand: SignOutCommand): Promise<void> {
    await this.authenticationService.signOut(
      signOutCommand.executor.userId,
      signOutCommand.refreshToken,
    );
  }
}
