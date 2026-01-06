import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product, ProductDocument } from './product.schema';
import { ProductDetail, ProductDetailDocument } from './product-detail.schema';
import { Review, ReviewDocument } from './review.schema';
import { scrapeProductsFromCategory } from '../scraper/product.scraper';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,

    @InjectModel(ProductDetail.name)
    private productDetailModel: Model<ProductDetailDocument>,

    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  // ✅ PRODUCT GRID (READ-ONLY)
  async getProducts(category: string, page = 1, limit = 10) {
    return this.productModel
      .find({ categorySlug: category })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  // ✅ PRODUCT DETAIL
  async getProductDetail(sourceId: string) {
    const detail = await this.productDetailModel
      .findOne({ sourceId })
      .lean();

    const reviews = await this.reviewModel
      .find({ sourceId })
      .lean();

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

  // ✅ SCRAPE + SAVE PRODUCTS
  async scrapeAndSaveProducts(
    categorySlug: string,
    categoryUrl: string,
  ) {
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
