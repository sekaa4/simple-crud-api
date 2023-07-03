export enum Endpoints_CONSTANTS {
  DEFAULT = '/',
  USERS = '/api/users',
  USER_ID = '/api/users/',
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const Status_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  BAD_GATEWAY: 502,
} as const;

export const Status_Message = {
  OK_MESSAGE: 'Success',
  BAD_REQUEST_MESSAGE: 'Bad Request',
  UNAUTHORIZED_MESSAGE: 'Unauthorized',
  FORBIDDEN_MESSAGE: 'Forbidden',
  NOT_FOUND_MESSAGE: 'Not Found',
  INTERNAL_SERVER_ERROR_MESSAGE: 'Internal Server Error',
  NOT_IMPLEMENTED_MESSAGE: 'Not Implemented',
  SERVICE_UNAVAILABLE_MESSAGE: 'Service Unavailable',
  BAD_GATEWAY_MESSAGE: 'Bad Gateway',
} as const;

export const DEFAULT_PORT = 4000;

export const DEFAULT_HOST = 'localhost';
