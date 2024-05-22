import { Module } from '@nestjs/common';
import { GoogleApiSearch } from './search-type/google-api.search';
import { GoogleHtmlSearch } from './search-type/google-html.search';
import { GoogleEngine } from './google.engine';

@Module({
  providers: [GoogleEngine, GoogleApiSearch, GoogleHtmlSearch],
  exports: [GoogleEngine],
})
export class GoogleModule {}
