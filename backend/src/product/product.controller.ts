import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductsDto } from './dto/get-products.dto';
import { GetProductDetailDto } from './dto/get-product-detail.dto';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET /api/products?category=fantasy&page=1&limit=10
  @Get()
  getProducts(@Query() query: GetProductsDto) {
    return this.productService.getProducts(
      query.category,
      query.page,
      query.limit,
    );
  }

  // GET /api/products/:sourceId
  @Get(':sourceId')
  getProductDetail(@Param() params: GetProductDetailDto) {
    return this.productService.getProductDetail(params.sourceId);
  }

  // POST /api/products/scrape/:category
  @Post('scrape/:category')
  scrapeCategory(@Param('category') category: string) {
    const CATEGORY_URLS: Record<string, string> = {
      fantasy:
        'https://www.worldofbooks.com/collections/fantasy-fiction-books',
    };

    return this.productService.scrapeAndSaveProducts(
      category,
      CATEGORY_URLS[category],
    );
  }
}
