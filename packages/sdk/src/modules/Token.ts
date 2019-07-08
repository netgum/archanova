import { IToken, IPaginated } from '../interfaces';
import { Api } from './Api';

export class Token {
  constructor(private api: Api) {
    //
  }

  public getTokens(page = 0): Promise<IPaginated<IToken>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `token?page=${page}`,
    });
  }

  public getToken(symbolOrAddress: string): Promise<IToken> {
    return this.api.sendRequest({
      method: 'GET',
      path: `token/${symbolOrAddress}`,
    });
  }
}
