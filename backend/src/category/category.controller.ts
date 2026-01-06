import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':slug')
  async getCategories(@Param('slug') slug: string) {
    const categories =
      await this.categoryService.getCategoriesByNavigation(slug);
    return { navigation: slug, categories };
  }

  @Post('scrape/:slug')
  async scrapeCategories(
    @Param('slug') slug: string,
    @Query('url') url: string,
  ) {
    return this.categoryService.scrapeAndSaveCategories(slug, url);
  }
}
