import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelBaseService } from '../../../common/base.service';
import { PairDto } from '../schema/pair.schema';

@Injectable()
export class PairRepository extends ModelBaseService<PairDto> {
  constructor(
    @InjectModel('pair')
    model: Model<PairDto>,
  ) {
    super(model);
  }
}
