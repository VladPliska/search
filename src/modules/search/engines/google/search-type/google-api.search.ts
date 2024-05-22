import { Injectable } from '@nestjs/common';
import { BaseSearchType } from '../../base.search-type';
import axios from 'axios';
import { GoogleSearchResult, SearchItem } from '../../../types/result.type';

@Injectable()
export class GoogleApiSearch implements BaseSearchType {
  private readonly apiKey = process.env.GOOGLE_API_KEY;
  private readonly customSearchId = process.env.GOOGLE_CUSTOM_SEARCH_ID;

  async search(phrase: string): Promise<SearchItem[]> {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(phrase)}&cx=${this.customSearchId}&key=${this.apiKey}`;

    try {
      const response = await axios.get(url);

      return this.mapGoogleAPIResponse(response.data?.items);
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  }

  private mapGoogleAPIResponse(
    searchedItems: GoogleSearchResult[],
  ): SearchItem[] {
    return searchedItems.map((item) => {
      return {
        link: item.link,
        title: item.title,
        htmlTitle: item.htmlTitle,
        image: this.grabImageFromSearchItem(item),
      };
    });
  }

  private grabImageFromSearchItem(item: GoogleSearchResult): string {
    const pageMap = item.pagemap;
    return pageMap?.cse_image?.[0]?.src || pageMap?.metatags?.[0]?.['og:image'];
  }
}
