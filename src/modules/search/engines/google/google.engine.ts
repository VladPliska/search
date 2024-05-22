import { BaseEngine } from '../base.engine';
import { Injectable } from '@nestjs/common';
import { SearchTypes } from '../base.search-type';
import { GoogleApiSearch } from './search-type/google-api.search';
import { GoogleHtmlSearch } from './search-type/google-html.search';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleEngine implements BaseEngine {
  constructor(
    private readonly configService: ConfigService,
    private readonly apiSearch: GoogleApiSearch,
    private readonly htmlSearch: GoogleHtmlSearch,
  ) {}

  async search(phrase: string): Promise<any[]> {
    const availableSearchTypes = {
      [SearchTypes.API]: this.apiSearch,
      [SearchTypes.HTML]: this.htmlSearch,
    };

    const searchType = this.configService.get('SEARCH_TYPE') ?? SearchTypes.API;
    const searchResult = await availableSearchTypes[searchType].search(phrase);

    return searchResult;
  }
}
