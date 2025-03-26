import DomainException from './DomainException';

export default class ImmutableFieldException extends DomainException {
  constructor() {
    super('Immutable field cannot be changed');
  }
}
