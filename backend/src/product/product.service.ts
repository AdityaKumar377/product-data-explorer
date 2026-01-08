import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product, ProductDocument } from './product.schema';
import { ProductDetail, ProductDetailDocument } from './product-detail.schema';
import { Review, ReviewDocument } from './review.schema';

import { scrapeProductsFromCategory } from '../scraper/product.scraper';
import { scrapeProductDetail } from '../scraper/product-detail.scraper';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(ProductDetail.name)
    private readonly productDetailModel: Model<ProductDetailDocument>,

    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  // ✅ PRODUCT GRID
  async getProducts(category: string, page = 1, limit = 10) {
    return this.productModel
      .find({ categorySlug: category })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  // ✅ PRODUCT DETAIL (ON-DEMAND SCRAPE + CACHE)
  async getProductDetail(sourceId: string) {
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

    let detail = await this.productDetailModel.findOne({ sourceId });

    const isExpired = false;

    const hasBadDescription =
      !detail ||
      !detail.description ||
      detail.description.length > 3000;

    if (!detail || isExpired || hasBadDescription) {
      const product = await this.productModel.findOne({ sourceId });

      if (!product) {
        throw new Error(`Product not found: ${sourceId}`);
      }

      console.log(`[SCRAPE] Fetching product detail: ${sourceId}`);

      const scraped = await scrapeProductDetail(product.sourceUrl);

      detail = await this.productDetailModel.findOneAndUpdate(
        { sourceId },
        {
          $set: {
            sourceId,
            description: scraped.description ?? '',
            specs: scraped.specs,
            updatedAt: new Date(),
          },
        },
        { upsert: true, new: true },
      );
    }

    const reviews = await this.reviewModel.find({ sourceId }).lean();

    const recommendations = await this.productModel
      .find({ sourceId: { $ne: sourceId } })
      .limit(3)
      .lean();

    return {
      detail,
      reviews,
      recommendations,
    };
  }

  // ✅ SCRAPE CATEGORY
  async scrapeAndSaveProducts(categorySlug: string, categoryUrl: string) {
    const scraped = await scrapeProductsFromCategory(
      categorySlug,
      categoryUrl,
    );

    let savedCount = 0;

    for (const item of scraped) {
      await this.productModel.updateOne(
        { sourceId: item.sourceId },
        {
          $set: {
            title: item.title,
            sourceUrl: item.sourceUrl,
            imageUrl: item.imageUrl,
            categorySlug: item.categorySlug,
            lastScrapedAt: new Date(),
          },
        },
        { upsert: true },
      );

      savedCount++;
    }

    return { count: savedCount };
  }
}