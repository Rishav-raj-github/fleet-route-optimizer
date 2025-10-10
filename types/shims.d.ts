declare module 'express';
declare module 'cors';
declare module 'http';
declare module 'ws';
declare module 'pg';
declare module 'redis';
declare module 'socket.io';
declare module 'path';

declare const __dirname: string;

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
