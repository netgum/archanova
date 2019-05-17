import { join } from 'path';
import { copy } from 'fs-extra';

export class Template {
  private readonly srcPath: string = join(__dirname, '..', 'template');

  constructor(private disPath: string) {

  }

  public async build(appName: string): Promise<any> {

  }
}
