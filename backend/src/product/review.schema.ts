import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {

  @Prop({ required: true })
  sourceId: string;

  @Prop()
  author: string;

  @Prop()
  rating: number;

  @Prop()
  text: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
