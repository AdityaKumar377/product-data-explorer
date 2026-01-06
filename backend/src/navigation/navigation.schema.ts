import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NavigationDocument = Navigation & Document;

@Schema({ timestamps: true })
export class Navigation {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  sourceUrl: string;

  @Prop()
  lastScrapedAt: Date;
}

export const NavigationSchema = SchemaFactory.createForClass(Navigation);
