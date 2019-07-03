import { IConfig } from '../interfaces';
import {
  SdkService,
  ServerService,
  StorageService,
  TemplateService,
} from '../services';

export interface IContextProps {
  config: IConfig;
  serverService: ServerService;
  sdkService: SdkService;
  storageService: StorageService;
  templateService: TemplateService;
}
