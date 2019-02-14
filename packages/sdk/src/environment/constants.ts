import { buildEnvironment } from './helpers';
import { IEnvironment } from './interfaces';

export const availableEnviroments: {
  development: IEnvironment;
} = {
  development: buildEnvironment({ host: 'development.archanova.run' })
    .extendServiceOptions('accountProxy', {
      contractAddress: '0xc9FE248E38a2F0Ac114932ecFF4B1bAc74E90b91',
    })
    .extendServiceOptions('ens', {
      contractAddress: '0x1B64cF07A6b5Ae7903784F827941eC9679E379e5',
    }),
};
