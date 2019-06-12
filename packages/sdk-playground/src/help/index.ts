import * as menu from './menu';
import * as statusBar from './statusBar';

const help: { [key: string]: string } = {};

function buildHelp(prefix: string, data: object): void {
  const keys = Object.keys(data);

  for (const key of keys) {
    help[`${prefix}.${key}`] = data[key];
  }
}

buildHelp('menu', menu);
buildHelp('statusBar', statusBar);

export default help;
