import { AxiosRequestConfig, ResponseType } from 'axios';

export interface ServiceClientPayload {
  url: string;
  payload?: any;
  headers?: any;
  responseType?: ResponseType;
}

export interface TryCatchRequestPayload {
  url: string;
  httpConfig: AxiosRequestConfig;
}
