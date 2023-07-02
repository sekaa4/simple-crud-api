import { Methods } from './constants';
import { RequestDataObject } from './request-data-object.type';

export interface RequestObject {
  method?: keyof typeof Methods;
  endpoint?: string;
  body: RequestDataObject;
}
