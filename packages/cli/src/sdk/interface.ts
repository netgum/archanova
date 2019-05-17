export interface ISdkOptions {
  env: 'kovan' | 'rinkeby' | 'ropsten' | 'local';
  localEnv: {
    host: string;
    port: number;
  };
  privateKey: Buffer;
}
