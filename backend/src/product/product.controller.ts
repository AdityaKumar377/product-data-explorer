import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ SCRAPE PRODUCTS (MUST BE FIRST)
  @Post('scrape/:category')
  async scrapeProducts(
    @Param('category') category: string,
    @Query('url') url: string,
  ) {
    return this.productService.scrapeAndSaveProducts(category, url);
  }

  // ✅ PRODUCT DETAIL
  @Get(':sourceId')
  async getProductDetail(@Param('sourceId') sourceId: string) {
    return this.productService.getProductDetail(sourceId);
  }

  // ✅ PRODUCT LIST
  @Get()
  async getProducts(
    @Query('category') category: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const data = await this.productService.getProducts(
      category,
      Number(page),
      Number(limit),
    );

    return {
      category,
      page: Number(page),
      limit: Number(limit),
      products: data,
    };
  }
}
