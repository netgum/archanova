import { jsonReplacer, jsonReviver } from '@netgum/utils';
import { IAction } from '../action';
import { URL_QUERY_FIELD_NAME } from './constants';

export function urlToAction(url: string): IAction {
  let result: IAction = null;

  if (url) {
    try {
      let [, raw] = url.split(`${URL_QUERY_FIELD_NAME}=`);
      [raw] = raw.split('&');

      if (raw) {
        const action: IAction = JSON.parse(decodeURIComponent(raw), jsonReviver);
        if (
          action.type &&
          action.payload &&
          action.timestamp
        ) {
          result = action;
        }
      }

    } catch (err) {
      result = null;
    }
  }

  return result;
}

export function actionToUrl(action: IAction, endpoint: string): string {
  let result: string = null;

  if (action && endpoint) {
    try {
      result = endpoint;
      if (result.includes('?')) {
        if (!result.endsWith('?')) {
          result = `${result}&`;
        }
      } else {
        result = `${result}?`;
      }

      result = `${result}${URL_QUERY_FIELD_NAME}=${encodeURIComponent(JSON.stringify(action, jsonReplacer))}`;
    } catch (err) {
      result = null;
    }
  }

  return result;
}
