import { IConfig } from './interfaces';

export const config: IConfig = {
  showHelp: !!parseInt(process.env.REACT_APP_SHOW_HELP, 10),
};
