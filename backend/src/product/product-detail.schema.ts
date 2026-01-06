import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDetailDocument = ProductDetail & Document;

@Schema({ timestamps: true })
export class ProductDetail {

  @Prop({ required: true, unique: true })
  sourceId: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  specs: Record<string, any>;

  @Prop()
  ratingsAvg: number;

  @Prop()
  reviewsCount: number;
}

export const ProductDetailSchema =
  SchemaFactory.createForClass(ProductDetail);
