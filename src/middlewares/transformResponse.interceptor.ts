import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { classToPlain, plainToClass } from 'class-transformer';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ADD_TRIM_RESPONSE,
  RESDTO,
  SKIP_TRANSFORMATION,
} from '../constant/metaKey.constants';
import { DtoNotFoundErrorException } from '../exceptions/dtoNotFoundError.exception';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest();
    const useTrimResponse = _.get(request, 'query.trim') === 'true';
    const urlPath = request.url;
    const skipTransformation = Reflect.getMetadata(
      SKIP_TRANSFORMATION,
      context.getHandler(),
    );
    if (skipTransformation) {
      return call$;
    } else {
      return call$.pipe(
        map((response) => {
          const [apiResponses, trimResponse] = [
            Reflect.getMetadata(RESDTO, context.getHandler()),
            Reflect.getMetadata(ADD_TRIM_RESPONSE, context.getHandler()),
          ];
          const successApiResponseDto =
            useTrimResponse && trimResponse
              ? { type: trimResponse }
              : _.chain(apiResponses)
                  .map((value, key) => ({
                    ...value,
                    status: _.toInteger(key),
                  }))
                  .filter((apiResponse) => apiResponse.status < 300)
                  .head()
                  .value();
          const resDtoClass = _.get(successApiResponseDto, 'type', null);
          if (!resDtoClass) {
            throw new DtoNotFoundErrorException(
              `Api Response Dto Not Found at path ${urlPath}`,
            );
          } else {
            return classToPlain(
              plainToClass(resDtoClass, response, {
                enableImplicitConversion: true,
              }),
            );
          }
        }),
      );
    }
  }
}
