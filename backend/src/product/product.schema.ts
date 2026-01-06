import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {

  @Prop({ required: true, unique: true })
  sourceId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  sourceUrl: string;

  @Prop({ required: true })
  categorySlug: string;

  @Prop()
  lastScrapedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
