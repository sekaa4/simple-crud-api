import 'dotenv/config';
import { createServer as createServerHttp, request } from 'node:http';
import { Endpoints } from './endpoints';
import { Methods, Status_CODE, Status_Message } from './types/constants';
import { RequestDataObject } from './types/request-data-object.type';
import { RequestObject } from './types/request-object.type';
import { ResponseObject } from './types/response-object.type';

const rawRequestToString = async (request) => {
  const buffers: string[] = [];
  for await (const chunk of request) {
    buffers.push(chunk.toString());
  }
  return buffers.join('');
};

const DEFAULT_PORT = 4000;

export const app = () => {
  const myServer = createServerHttp(async (request, response) => {
    let body: RequestDataObject = {} as RequestDataObject;
    if (request.method === Methods.POST || request.method === Methods.PUT) {
      try {
        body = JSON.parse(await rawRequestToString(request));
      } catch (error) {
        console.log(error);
        response.writeHead(Status_CODE.INTERNAL_SERVER_ERROR, Status_Message.INTERNAL_SERVER_ERROR_MESSAGE, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify({ message: Status_Message.INTERNAL_SERVER_ERROR_MESSAGE }));
        return;
      }
    }

    const requestObject: RequestObject = {
      endpoint: request.url,
      method: request.method as Methods,
      body: body as RequestDataObject,
    };
    const endpoints = new Endpoints('localhost');
    const responseObject: ResponseObject = endpoints.chooseEndpoint(requestObject);
    const { statusCode, statusMessage, data, message, method } = responseObject;

    const jsonData = data ? JSON.stringify(data) : message ? JSON.stringify({ message }) : undefined;

    response.writeHead(statusCode, statusMessage, { 'Content-Type': 'application/json' });
    response.end(jsonData);
  });

  const PORT = process.env.PORT || DEFAULT_PORT;

  myServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('To terminate it, use Ctrl+C combination');
  });
};
