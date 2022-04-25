import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as _ from 'lodash';

import {
  ServiceClientPayload,
  TryCatchRequestPayload,
} from './serviceClient.interface';
import { NotFoundErrorException } from '../../exceptions/notFoundError.exception';
import { CallBackResponseErrorException } from '../../exceptions/callBackResponseError.exception';

@Injectable()
export class ServiceClient {
  constructor(readonly httpService: HttpService) {}

  private async tryCatchRequest({
    url,
    httpConfig,
  }: TryCatchRequestPayload): Promise<any> {
    try {
      const result = await this.httpService.axiosRef(httpConfig);
      return _.includes(
        ['stream', 'arraybuffer'],
        _.get(httpConfig, 'responseType'),
      )
        ? result
        : result.data;
    } catch (e) {
      if (_.endsWith(url, 'healthz')) {
        return 'FAIL';
      }
      const errMsg = JSON.stringify({
        config: e.config,
        stack: e.stack,
      });
      if (
        _.includes(['stream', 'arraybuffer'], _.get(httpConfig, 'responseType'))
      ) {
        const errorCode = _.get(e, 'response.status', 500);
        switch (errorCode) {
          case 404:
            throw new NotFoundErrorException(errMsg);
          default:
            throw new CallBackResponseErrorException(errMsg);
        }
      } else {
        throw new CallBackResponseErrorException(errMsg);
      }
    }
  }

  get(payload: ServiceClientPayload): Promise<any> {
    const { payload: params = {}, ...otherInfo } = payload;
    return this.tryCatchRequest({
      ...otherInfo,
      httpConfig: {
        method: 'get',
        headers: payload.headers,
        url: payload.url,
        params,
        responseType: payload.responseType,
      },
    });
  }

  post(payload: ServiceClientPayload): Promise<any> {
    const { payload: requestBody = {}, ...otherInfo } = payload;
    return this.tryCatchRequest({
      ...otherInfo,
      httpConfig: {
        method: 'post',
        headers: payload.headers,
        url: payload.url,
        data: requestBody,
      },
    });
  }

  put(payload: ServiceClientPayload): Promise<any> {
    const { payload: requestBody = {}, ...otherInfo } = payload;
    return this.tryCatchRequest({
      ...otherInfo,
      httpConfig: {
        method: 'put',
        headers: payload.headers,
        url: payload.url,
        data: requestBody,
      },
    });
  }

  patch(payload: ServiceClientPayload): Promise<any> {
    const { payload: requestBody = {}, ...otherInfo } = payload;
    return this.tryCatchRequest({
      ...otherInfo,
      httpConfig: {
        method: 'patch',
        headers: payload.headers,
        url: payload.url,
        data: requestBody,
      },
    });
  }

  delete(payload: ServiceClientPayload): Promise<any> {
    const { payload: params = {}, ...otherInfo } = payload;
    return this.tryCatchRequest({
      ...otherInfo,
      httpConfig: {
        method: 'delete',
        headers: payload.headers,
        url: payload.url,
        params,
      },
    });
  }
}
