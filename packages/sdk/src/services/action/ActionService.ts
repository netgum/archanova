import { UniqueBehaviorSubject } from 'rxjs-addons';
import { filter, map, tap } from 'rxjs/operators';
import { IAction, IActionService } from './interfaces';
import { ActionTypes } from './constants';

export class ActionService implements IActionService {
  public $incoming = new UniqueBehaviorSubject<IAction>(null);
  public $accepted = new UniqueBehaviorSubject<IAction>(null);

  constructor(private options: IActionService.IOptions = {}) {
    //
  }

  public setup(): void {
    const { autoAccept } = this.options;

    if (autoAccept) {
      this
        .$incoming
        .pipe(
          filter(action => !!action),
          tap(() => this.acceptAction()),
        )
        .subscribe();
    }
  }

  public acceptAction(action: IAction = null): void {
    if (!action) {
      action = this.$incoming.getValue();
      if (action) {
        this.$incoming.next(null);
      }
    }
    if (action) {
      this.$accepted.next(action);
    }
  }

  public dismissAction(): void {
    this.$incoming.next(null);
    this.$accepted.next(null);
  }

  public createAction<T = any>(type: ActionTypes, payload: T): IAction<T> {
    return {
      type,
      payload,
      timestamp: Date.now(),
    };
  }
}
