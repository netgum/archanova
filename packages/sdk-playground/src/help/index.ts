import * as menu from './menu';

const help: { [key: string]: string } = {};

const keys = Object.keys(menu);

for (const key of keys) {
  help[`menu.${key}`] = menu[key];
}

export default help;
