import { Controller, Get, Post } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('api/navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  async getNavigation() {
    const data = await this.navigationService.getNavigationData();
    return { data };
  }

  @Post('scrape')
  async scrapeNavigation() {
    return this.navigationService.scrapeAndSaveNavigation();
  }
}
