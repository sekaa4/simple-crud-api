import 'dotenv/config';
import { createServer as createServerHttp, request as requestHttp } from 'node:http';
import { Endpoints } from './endpoints';
import { Methods, Status_CODE, Status_Message, DEFAULT_PORT, DEFAULT_HOST } from './types/constants';
import { RequestDataObject } from './types/request-data-object.type';
import { RequestObject } from './types/request-object.type';
import { ResponseObject } from './types/response-object.type';
import cluster, { Worker } from 'node:cluster';
import { cpus } from 'node:os';
import { fork } from 'node:child_process';
import { resolve } from 'node:path';

const scriptPath = resolve(__dirname, './worker-with-data-base.ts');
const rawRequestToString = async (request) => {
  const buffers: string[] = [];
  for await (const chunk of request) {
    buffers.push(chunk.toString());
  }
  return buffers.join('');
};

export const app = () => {
  const myServer = createServerHttp(async (request, response) => {
    if (cluster.isWorker) {
      const workerDataRequest = requestHttp(
        {
          host: DEFAULT_HOST,
          method: request.method,
          path: request.url,
          port: 8000,
        },
        (workerDataResponse) => {
          response.writeHead(response.statusCode, response.statusMessage, {
            'Content-Type': 'application/json',
          });
          workerDataResponse.pipe(response);
        },
      );
      request.pipe(workerDataRequest);
      return;
    }

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
    const endpoints = new Endpoints(DEFAULT_HOST);
    const responseObject: ResponseObject = endpoints.chooseEndpoint(requestObject);
    const { statusCode, statusMessage, data, message } = responseObject;

    const jsonData = data ? JSON.stringify(data) : message ? JSON.stringify({ message }) : undefined;

    response.writeHead(statusCode, statusMessage, { 'Content-Type': 'application/json' });
    response.end(jsonData);
  });

  const postFix = cluster.isWorker && cluster.worker ? cluster.worker.id : 0;
  const PORT = +(process.env.PORT || DEFAULT_PORT) + postFix;
  const multi = process.env.MULTIPLE || false;

  if (cluster.isPrimary && multi) {
    const workersNumber = cpus().length - 1;
    const workers: Worker[] = [];

    for (let index = 0; index < workersNumber; index++) {
      workers.push(cluster.fork());
    }

    fork(scriptPath);

    cluster.on('fork', (worker) => {
      console.log(`Worker #${worker.id} is online`);
    });

    cluster.on('exit', (worker) => {
      console.log(`Worker #${worker.id} is exit`);
      cluster.fork();
    });

    let workerCounter = 0;

    createServerHttp((request, response) => {
      workerCounter = (workerCounter + 1) % workers.length;

      const workerRequest = requestHttp(
        {
          host: DEFAULT_HOST,
          headers: request.headers,
          method: request.method,
          path: request.url,
          port: PORT + workerCounter,
        },
        (workerResponse) => {
          response.writeHead(response.statusCode, response.statusMessage, {
            'Content-Type': 'application/json',
          });
          workerResponse.pipe(response);
        },
      );
      request.pipe(workerRequest);
    }).listen(PORT, () => {
      console.log(`Load balancer running on port ${PORT}`);
      console.log('To terminate it, use Ctrl+C combination');
    });
  } else {
    myServer.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
      console.log('To terminate it, use Ctrl+C combination');
    });
  }
};
