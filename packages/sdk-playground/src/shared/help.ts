import { skip } from 'rxjs/operators';
import { IHelp } from './interfaces';
import { BehaviorSubject } from 'rxjs';
import { config } from '../config';

const STORAGE_ACTIVE_KEY = 'playground:help:active';

const active$ = new BehaviorSubject<boolean>(
  config.activeFeatures.help && !!localStorage.getItem(STORAGE_ACTIVE_KEY),
);

const stream$ = new BehaviorSubject<string>(null);

function show(alias: string): void {
  stream$.next(alias);
}

function hide(): void {
  stream$.next(null);
}

function toggle(): void {
  active$.next(!active$.value);
}

export const help: IHelp = {
  active$,
  stream$,
  show,
  hide,
  toggle,
};

active$
  .pipe(
    skip(1),
  )
  .subscribe((active) => {
    if (active) {
      localStorage.setItem(STORAGE_ACTIVE_KEY, '1');
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_KEY);
    }
  });
