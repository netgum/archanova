import { TUniqueBehaviorSubject } from 'rxjs-addons';
import { IPlatformService } from '../platform';

export interface ISessionService extends IPlatformService {
  readonly ready$: TUniqueBehaviorSubject<boolean>;
  readonly ready: boolean;

  create(): Promise<void>;

  reset(): Promise<void>;
}
