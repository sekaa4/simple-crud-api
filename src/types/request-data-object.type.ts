import { DataObject } from './data-object.type';

export type RequestDataObject = Omit<DataObject, 'id'>;
