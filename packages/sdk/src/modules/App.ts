import { IApp, IAccountGame, IPaginated } from '../interfaces';
import { Api } from './Api';

export class App {
  constructor(private api: Api) {
    //
  }

  public getApps(page = 0): Promise<IPaginated<IApp>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `app?page=${page}`,
    });
  }

  public getApp(alias: string): Promise<IApp> {
    return this.api.sendRequest({
      method: 'GET',
      path: `app/${alias}`,
    });
  }

  public getAppOpenGames(alias: string, page = 0): Promise<IPaginated<IAccountGame>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `app/${alias}/game?page=${page}`,
    });
  }
}
