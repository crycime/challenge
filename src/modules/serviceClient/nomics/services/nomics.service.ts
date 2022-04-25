import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import { ServiceClient } from '../../serviceClient.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComicsService extends ServiceClient {
  constructor(
    readonly configService: ConfigService,
    readonly httpService: HttpService,
  ) {
    super(httpService);
  }

  currenciesTicker({
    ids,
    convert,
  }: {
    ids: string;
    convert: string;
  }): Promise<
    { name; currency; price; '1h': { volume: string; price_change: string } }[]
  > {
    return this.get({
      url: `/currencies/ticker?key=${this.configService.get(
        'SERVICES.nomics.apiKey',
      )}&ids=${ids}&interval=1h&convert=${convert}`,
    });
  }
}
