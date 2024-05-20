import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './services/search.service';
import { GoogleEngine } from './engines/google.engine';
import { PageParserService } from './services/page-parser.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, PageParserService, GoogleEngine],
})
export class SearchModule {}
