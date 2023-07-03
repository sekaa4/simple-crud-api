import { Endpoints_CONSTANTS, Methods, Status_CODE, Status_Message } from './types/constants';
import { RequestObject } from './types/request-object.type';
import { ResponseObject } from './types/response-object.type';
import { data } from './data';
import { v4 as uuidv4, validate } from 'uuid';
import { RequestDataObject } from './types/request-data-object.type';

export class Endpoints {
  public domainName: string;
  constructor(domainName: string) {
    this.domainName = domainName;
  }

  checkBody(body: RequestDataObject): { isValidBodySchema: boolean; message?: string } {
    const keysSchema = [
      { name: 'username', type: 'String' },
      { name: 'age', type: 'Number' },
      { name: 'hobbies', type: 'Array' },
    ];
    const bodyKeys = Object.keys(body);

    if (bodyKeys.length !== keysSchema.length) {
      return {
        isValidBodySchema: false,
        message: `${Status_Message.BAD_REQUEST_MESSAGE}: fields in body request incorrect`,
      };
    }

    const errorFields: { field: string; message: string }[] = [];
    const validFields = bodyKeys.map((key) => {
      const isExist = keysSchema.find((object, inx) => {
        const type = Object.prototype.toString.call(body[key]).slice(8, -1);

        if (object.name === key && type === object.type && object.type !== 'Array') {
          keysSchema.splice(inx, 1);
          return true;
        } else if (object.name === key && type === object.type && object.type === 'Array') {
          const hobbies = body[key] as unknown[];
          const isTypeOfString = hobbies.every((hobby) => typeof hobby === 'string');
          if (isTypeOfString) return true;
          errorFields.push({ field: key, message: 'Incorrect field' });
          return false;
        } else {
          errorFields.push({ field: key, message: 'Incorrect field' });
          return false;
        }
      });
      if (isExist) {
        return key;
      }
      return false;
    });

    const isValidate = validFields.every((field) => field !== false);
    if (!isValidate) {
      return {
        isValidBodySchema: false,
        message: `${Status_Message.BAD_REQUEST_MESSAGE}, request body incorrect`,
      };
    }
    return { isValidBodySchema: true };
  }

  chooseEndpoint(requestObject: RequestObject) {
    const { endpoint, method, body } = requestObject;

    const isDynamicPath = endpoint && /\/api\/users\/*/.test(endpoint) && endpoint.split('/').length === 4;

    if (isDynamicPath && method === Methods.GET) {
      const id = endpoint.split('/')[3]!;
      const isValidUUID = validate(id);
      const user = data.find((user) => user.id === id);

      if (!isValidUUID) {
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.BAD_REQUEST_MESSAGE,
          method: method,
          statusCode: Status_CODE.BAD_REQUEST,
          message: `User's ID is invalid (not uuid)`,
        };

        return responseObject;
      }

      if (isValidUUID && user) {
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.OK_MESSAGE,
          method: method,
          statusCode: Status_CODE.OK,
          data: user,
        };

        return responseObject;
      } else if (isValidUUID && !user) {
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.NOT_FOUND_MESSAGE,
          method: method,
          statusCode: Status_CODE.NOT_FOUND,
          message: `User with ID <${id}> doesn't exist`,
        };

        return responseObject;
      }
    }

    if (isDynamicPath && method === Methods.PUT && body) {
      const id = endpoint.split('/')[3]!;
      const isValidUUID = validate(id);
      const checkBodySchema = this.checkBody(body);
      const { isValidBodySchema } = checkBodySchema;

      if (isValidUUID && isValidBodySchema) {
        const user = data.find((user) => user.id === id);

        if (isValidUUID && user) {
          const updatedUser = { id, ...body };
          data.splice(data.indexOf(user), 1, updatedUser);
          const responseObject: ResponseObject = {
            statusMessage: Status_Message.OK_MESSAGE,
            method: method,
            statusCode: Status_CODE.OK,
            data: updatedUser,
          };

          return responseObject;
        } else if (isValidUUID && !user) {
          const responseObject: ResponseObject = {
            statusMessage: Status_Message.NOT_FOUND_MESSAGE,
            method: method,
            statusCode: Status_CODE.NOT_FOUND,
            message: `User with ID <${id}> doesn't exist`,
          };

          return responseObject;
        }
      }
      const newMessage = isValidUUID
        ? isValidBodySchema
          ? Status_Message.BAD_REQUEST_MESSAGE
          : `Request body does not contain required fields`
        : `User's ID is invalid (not uuid)`;

      const responseObject: ResponseObject = {
        statusMessage: Status_Message.BAD_REQUEST_MESSAGE,
        method: method,
        statusCode: Status_CODE.BAD_REQUEST,
        message: newMessage,
      };

      return responseObject;
    } else if (isDynamicPath && method === Methods.PUT && !body) {
      const responseObject: ResponseObject = {
        statusMessage: Status_Message.BAD_REQUEST_MESSAGE,
        method: method,
        statusCode: Status_CODE.BAD_REQUEST,
        message: `Body request doesn't exist, please write body in your request`,
      };

      return responseObject;
    }

    if (isDynamicPath && method === Methods.DELETE) {
      const id = endpoint.split('/')[3]!;
      const isValidUUID = validate(id);
      const user = data.find((user) => user.id === id);

      if (!isValidUUID) {
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.BAD_REQUEST_MESSAGE,
          method: method,
          statusCode: Status_CODE.BAD_REQUEST,
          message: `User's ID is invalid (not uuid)`,
        };

        return responseObject;
      }

      if (isValidUUID && user) {
        data.splice(data.indexOf(user), 1);
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.OK_MESSAGE,
          method: method,
          statusCode: Status_CODE.NO_CONTENT,
        };

        return responseObject;
      } else if (isValidUUID && !user) {
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.NOT_FOUND_MESSAGE,
          method: method,
          statusCode: Status_CODE.NOT_FOUND,
          message: `User with ID <${id}> doesn't exist`,
        };

        return responseObject;
      }
    }

    switch (endpoint) {
      case Endpoints_CONSTANTS.DEFAULT: {
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.OK_MESSAGE,
          method: method,
          statusCode: Status_CODE.OK,
          message: 'invalid path',
        };
        return responseObject;
      }
      case Endpoints_CONSTANTS.USERS: {
        if (method === Methods.GET) {
          const responseObject: ResponseObject = {
            statusMessage: Status_Message.OK_MESSAGE,
            method: method,
            statusCode: Status_CODE.OK,
            data,
          };
          return responseObject;
        }
        if (method === Methods.POST && body) {
          const checkBodySchema = this.checkBody(body);
          const id = uuidv4();
          const { isValidBodySchema, message } = checkBodySchema;

          if (isValidBodySchema) {
            const newUser = { id, ...body };
            data.push(newUser);
            const responseObject: ResponseObject = {
              statusMessage: Status_Message.OK_MESSAGE,
              method: method,
              statusCode: Status_CODE.CREATED,
              data: newUser,
            };

            return responseObject;
          } else {
            const responseObject: ResponseObject = {
              statusMessage: Status_Message.BAD_REQUEST_MESSAGE,
              method: method,
              statusCode: Status_CODE.BAD_REQUEST,
              message: message || `Request body does not contain required fields`,
            };

            return responseObject;
          }
        } else if (method === Methods.POST && !body) {
          const responseObject: ResponseObject = {
            statusMessage: Status_Message.BAD_REQUEST_MESSAGE,
            method: method,
            statusCode: Status_CODE.BAD_REQUEST,
            message: `Body request doesn't exist, please write body in your request`,
          };

          return responseObject;
        } else {
          const responseObject: ResponseObject = {
            statusMessage: Status_Message.BAD_REQUEST_MESSAGE,
            method: method,
            statusCode: Status_CODE.BAD_REQUEST,
            message: Status_Message.BAD_REQUEST_MESSAGE,
          };

          return responseObject;
        }
      }

      default: {
        const responseObject: ResponseObject = {
          statusMessage: Status_Message.NOT_FOUND_MESSAGE,
          method: method,
          statusCode: Status_CODE.NOT_FOUND,
          message: "Request path doesn't exist",
        };
        return responseObject;
      }
    }
  }
}
