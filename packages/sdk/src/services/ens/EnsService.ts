import { inject, injectable } from 'inversify';
import { IEnsService } from './interfaces';

@injectable()
export class EnsService implements IEnsService {
  public static TYPES = {
    Options: Symbol('EnsService:Options'),
  };

  constructor(
    @inject(EnsService.TYPES.Options) options: IEnsService.IOptions,
  ) {
    //
  }
}
