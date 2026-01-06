import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

import { scrapeProductsFromCategory } from './scraper/product.scraper';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  await scrapeProductsFromCategory(
  'fantasy',
  'https://www.worldofbooks.com/collections/fantasy-fiction-books',
);
console.log('Connected MongoDB database:', mongoose.connection.name);

}
bootstrap();
