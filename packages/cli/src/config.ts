import { relative, resolve } from 'path';
import commander from 'commander';

let storageRootPath: string = process.cwd();

commander
  .arguments('[path]')
  .option('-e --env <env>', 'environment', /^(local|kovan|rinkeby)$/i, 'kovan')
  .option('--account-address <address>', 'account address')
  .option('--account-ens-name <name>', 'account ens name')
  .option('--local-env-host <host>', 'local host', 'localhost')
  .option('--admin', 'admin mode')
  .option('--no-storage', 'don\'t use storage')
  .action((workingDir) => {
    if (workingDir) {
      storageRootPath = resolve(relative(storageRootPath, workingDir));
    }
  })
  .parse(process.argv);

const config = commander as any as {
  env: string,
  accountAddress: string;
  accountEnsName: string;
  localEnvHost: string;
  admin: boolean;
  storage: boolean;
  storageRootPath: string;
};

config.storageRootPath = resolve(__dirname, '../demo');

export default config;
