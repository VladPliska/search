import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './services/search.service';
import { PageParserService } from './services/page-parser.service';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleModule } from './engines/google/google.module';

@Module({
  imports: [CacheModule.register(), GoogleModule],
  controllers: [SearchController],
  providers: [SearchService, PageParserService],
})
export class SearchModule {}
