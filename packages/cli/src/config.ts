import commander from 'commander';

commander
  .arguments('[path]')
  .option('-e --env <env>', 'environment [ropsten,rinkeby,kovan,local]', /^(ropsten|rinkeby|kovan|local)$/i, 'ropsten')
  .option('--local-env-host <host>', 'local host', 'localhost')
  .option('--admin', 'admin mode')
  .option('--no-storage', 'don\'t use storage')
  .parse(process.argv);

const config = commander as any as {
  env: string,
  localEnvHost: string;
  admin: boolean;
  storage: boolean;
};

export default config;
