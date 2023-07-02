import { data } from 'src/data';
import { Methods, Status_CODE, Status_Message } from './constants';
import { DataObject } from './data-object.type';

type ValueOf<T> = T[keyof T];

export interface ResponseObject {
  method?: keyof typeof Methods;
  statusCode: ValueOf<typeof Status_CODE>;
  statusMessage: ValueOf<typeof Status_Message>;
  message?: string;
  data?: DataObject[] | DataObject;
}
