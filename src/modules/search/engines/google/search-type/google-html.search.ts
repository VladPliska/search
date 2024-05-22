import { Injectable } from '@nestjs/common';
import { BaseSearchType } from '../../base.search-type';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchItem } from '../../../types/result.type';

@Injectable()
export class GoogleHtmlSearch implements BaseSearchType {
  async search(phrase: string): Promise<SearchItem[]> {
    try {
      const searchResult = await axios.get(
        `https://www.google.com/search?q=${phrase}&gl=us&hl=en`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
          },
        },
      );

      return this.mapResponse(searchResult.data);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // We can move it to some another abstract level
  private mapResponse(data: any): SearchItem[] {
    const $ = cheerio.load(data);

    const results: SearchItem[] = [];

    $('div.g').each((_, element) => {
      const titleElement = $(element).find('h3');
      const linkElement = $(element).find('a');
      if (titleElement.length && linkElement.length) {
        const title = titleElement.text();
        const link = linkElement.attr('href');

        results.push({ title, htmlTitle: titleElement.html(), link });
      }
    });

    return results;
  }
}
