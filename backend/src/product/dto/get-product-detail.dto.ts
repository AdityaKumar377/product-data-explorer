import { IsString } from 'class-validator';

export class GetProductDetailDto {
  @IsString()
  sourceId: string;
}
