import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { SearchService } from './services/search.service';
import { SearchDto } from './dto/search.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('search')
// @UseInterceptors(CacheInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @CacheTTL(Infinity)
  async search(@Query() { query }: SearchDto) {
    const result = await this.searchService.search(query);

    return result;
  }
}
