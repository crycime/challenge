import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BasicFields } from '../../../common/base.schema';
import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConvertFromId } from '../../../decorators/dto/convertFromId.dto.decorator';

export const pairValidExample = {
  _id: '61cc1f3a428d36921fdcf8d2',
  id: '61cc1f3a428d36921fdcf8d2',
  name: 'Ethereum',
  currency: 'ETH',
  convert: 'USD',
  price: '3104.46666752',
  volume: '831812243.27',
  price_change: '34.95363492',
};

@Exclude()
@Schema({
  timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' },
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  id: false,
  collection: 'pair',
})
export class PairDto extends BasicFields {
  @Expose()
  @ConvertFromId()
  @IsMongoId()
  @ApiProperty({
    example: pairValidExample.id,
    description: 'pair id',
  })
  readonly id: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: pairValidExample.name,
  })
  @Prop({ type: String, required: true })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: pairValidExample.currency,
  })
  @Prop({ type: String, required: true })
  currency: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: pairValidExample.convert,
  })
  @Prop({ type: String, required: true })
  convert: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: pairValidExample.price,
  })
  @Prop({ type: String, required: true })
  price: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: pairValidExample.volume,
  })
  @Prop({ type: String, required: true })
  volume: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: pairValidExample.price_change,
  })
  @Prop({ type: String, required: true })
  price_change: string;
}

const PairSchema = SchemaFactory.createForClass(PairDto);
PairSchema.plugin(mongooseLeanVirtuals);

PairSchema.index(
  { name: 1 },
  {
    unique: true,
  },
);

export { PairSchema };
