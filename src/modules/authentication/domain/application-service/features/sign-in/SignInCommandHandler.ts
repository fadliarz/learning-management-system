import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import { AuthenticationService } from '../../ports/output/service/AuthenticationService';
import SignInCommand from './dto/SignInCommand';
import { Tokens } from '../../../domain-core/entity/Tokens';

@Injectable()
export default class SignInCommandHandler {
  constructor(
    @Inject(DependencyInjection.AUTHENTICATION_SERVICE)
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async execute(signInCommand: SignInCommand): Promise<Tokens> {
    return await this.authenticationService.signIn(
      signInCommand.email,
      signInCommand.password,
    );
  }
}
