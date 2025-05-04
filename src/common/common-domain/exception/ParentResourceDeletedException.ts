import HttpException from './HttpException';
import { HttpStatus } from '@nestjs/common';
import { ResourceName } from '../ResourceName';

export default class ParentResourceDeletedException extends HttpException {
  constructor(
    param: {
      parentResource?: ResourceName;
      childResource?: ResourceName;
      throwable?: unknown;
    } = {},
  ) {
    super(
      HttpStatus.FORBIDDEN,
      `The ${param.parentResource ? param.parentResource.toLowerCase() : 'parent resource'} has been deleted. As a result, this ${param.childResource ? param.childResource.toLowerCase() : 'resource'} will also be removed shortly!`,
      param.throwable ?? null,
    );
  }
}
