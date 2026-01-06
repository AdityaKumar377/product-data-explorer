import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { scrapeCategories } from '../scraper/category.scraper';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async getCategoriesByNavigation(navigationSlug: string) {
    return this.categoryModel
      .find({ navigationSlug })
      .lean();
  }

  async scrapeAndSaveCategories(
    navigationSlug: string,
    navigationUrl: string,
  ) {
    const scraped = await scrapeCategories(
      navigationSlug,
      navigationUrl,
    );

    for (const item of scraped) {
      await this.categoryModel.updateOne(
        { slug: item.slug },
        {
          $set: {
            title: item.title,
            navigationSlug: item.navigationSlug,
            lastScrapedAt: new Date(),
          },
        },
        { upsert: true },
      );
    }

    return { count: scraped.length };
  }
}
