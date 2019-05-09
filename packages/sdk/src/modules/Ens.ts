import { getEnsNameHash, getEnsNameInfo, normalizeEnsName } from '@netgum/utils';
import { Eth } from './Eth';
import { State } from './State';

export class Ens {
  constructor(private options: Ens.IOptions, private eth: Eth, private state: State) {
    this.state.ens$.next(this.buildState());
  }

  public buildName(label: string, rootName: string = null): string {
    let result: string = null;

    if (label) {
      const { supportedRoots } = this.state.ens;

      if (supportedRoots.length) {
        if (!rootName) {
          ({ name: rootName } = supportedRoots[0]);
        }
        const nameInfo = getEnsNameInfo(label, rootName);

        if (
          nameInfo &&
          nameInfo.rootNode &&
          supportedRoots.find(({ name }) => name === nameInfo.rootNode.name)
        ) {
          result = nameInfo.name;
        }
      }
    }

    return result;
  }

  private buildState(): State.IEns {
    const { supportedRootNames } = this.options;
    return {
      supportedRoots: supportedRootNames ?
        supportedRootNames
          .map((domain) => {
            const name = normalizeEnsName(domain);
            const nameHash = getEnsNameHash(name);

            return {
              name,
              nameHash,
            };
          })
        : [],
    };
  }
}

export namespace Ens {
  export interface IOptions {
    supportedRootNames: string[];
  }
}
