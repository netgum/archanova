import { Api } from './Api';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountGame {
  constructor(
    private api: Api,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }
}
