import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { ConvertDate } from '../decorators/dto/convertDate.dto.decorator';

@Exclude()
@Schema()
export class BasicFields {
  @Expose()
  @ApiProperty()
  @ConvertDate('createdTime')
  @IsDate()
  createdTime: number;

  @Expose()
  @ApiProperty()
  @ConvertDate('updatedTime')
  @IsDate()
  updatedTime: number;

  @Expose()
  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: 'system', required: true })
  createdBy: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: 'system', required: true })
  updatedBy: string;
}
