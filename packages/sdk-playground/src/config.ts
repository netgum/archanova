const {
  REACT_APP_SDK_ENV,
  REACT_APP_SDK_LOCAL_ENV_HOST,
  REACT_APP_SDK_LOCAL_ENV_PORT,
  REACT_APP_SDK_AUTO_INITIALIZE,
  REACT_APP_SDK_AUTO_ACCEPT_ACTION,
  REACT_APP_SDK_ACTIVATE_FEATURES,
} = process.env;

const activeFeatures: any = (REACT_APP_SDK_ACTIVATE_FEATURES || '')
  .split(',')
  .reduce((result: { [key: string]: boolean }, key: string) => {
    if (key) {
      result = {
        ...result,
        [key]: true,
      };
    }

    return result;
  }, {});

export interface IConfig {
  activeFeatures: {
    help: boolean;
  };
  sdk: {
    env: string;
    localEnv: {
      host: string;
      port: number;
    };
    autoInitialize: boolean;
    autoAcceptAction: boolean;
  };
}

export const config: IConfig = {
  activeFeatures,
  sdk: {
    env: REACT_APP_SDK_ENV || '',
    localEnv: {
      host: REACT_APP_SDK_LOCAL_ENV_HOST || null,
      port: parseInt(REACT_APP_SDK_LOCAL_ENV_PORT, 10) || null,
    },
    autoInitialize: !!parseInt(REACT_APP_SDK_AUTO_INITIALIZE || '1', 10),
    autoAcceptAction: !!parseInt(REACT_APP_SDK_AUTO_ACCEPT_ACTION || '1', 10),
  },
};
