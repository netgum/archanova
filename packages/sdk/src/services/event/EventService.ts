import { Subject } from 'rxjs';
import { IState } from '../../state';
import { IApiService } from '../api';
import { IEventService, IEvent } from './interfaces';

export class EventService implements IEventService {

  public $incoming = new Subject<IEvent>();

  constructor(
    private state: IState,
    private apiService: IApiService,
  ) {
    //
  }

  public setup(): Subject<boolean> {
    const { connected$, message$ } = this.apiService.buildWsSubjects();

     message$.subscribe(this.$incoming);

    return connected$;
  }
}
