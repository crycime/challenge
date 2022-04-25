import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PairHandlerService } from '../services/pair.handler.service';
import { TransformResponseInterceptor } from '../../../middlewares/transformResponse.interceptor';
import { PairDto } from '../schema/pair.schema';

@ApiTags('pair')
@Controller('pair')
export class PairController {
  constructor(private readonly pairHandlerService: PairHandlerService) {}

  @Get()
  @UseInterceptors(TransformResponseInterceptor)
  @ApiOperation({
    summary: 'getPairList',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PairDto,
    isArray: true,
  })
  async getPairList(): Promise<PairDto[]> {
    return await this.pairHandlerService.getPairList();
  }
}
