import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Navigation, NavigationDocument } from './navigation.schema';
import { scrapeNavigation } from '../scraper/navigation.scraper';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Navigation.name)
    private navigationModel: Model<NavigationDocument>,
  ) {}

  async getNavigationData() {
    return this.navigationModel.find().lean();
  }

  async scrapeAndSaveNavigation() {
    const scraped = await scrapeNavigation();

    for (const item of scraped) {
      await this.navigationModel.updateOne(
        { slug: item.slug },
        {
          $set: {
            title: item.title,
            sourceUrl: item.sourceUrl,
            lastScrapedAt: new Date(),
          },
        },
        { upsert: true },
      );
    }

    return { count: scraped.length };
  }
}
