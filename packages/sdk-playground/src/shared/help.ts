import { IHelp } from './interfaces';
import { BehaviorSubject } from 'rxjs';

const stream$ = new BehaviorSubject<string>(null);

function show(alias: string): void {
  stream$.next(alias);
}

function hide(): void {
  stream$.next(null);
}

export const help: IHelp = {
  stream$,
  show,
  hide,
};
