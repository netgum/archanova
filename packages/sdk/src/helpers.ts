import { SdkEnvironmentNames, getSdkEnvironment } from './environments';
import { Environment } from './modules';
import { Sdk } from './Sdk';

/**
 * creates sdk
 * @param env
 */
export function createSdk(env: SdkEnvironmentNames | Environment): Sdk {
  let environment: Environment = null;
  if (env instanceof Environment) {
    environment = env;
  } else {
    environment = getSdkEnvironment(env);
  }

  return new Sdk(environment);
}
