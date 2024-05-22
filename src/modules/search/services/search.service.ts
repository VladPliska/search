import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleEngine } from '../engines/google/google.engine';
import { SearchItem } from '../types/result.type';
import { delay } from '../../../utils';
import { SearchEngines } from '../types/engine.type';
import { PageParserService } from './page-parser.service';

@Injectable()
export class SearchService {
  //readlock
  private readonly inProgressRequests = new Map<string, Promise<any>>();

  constructor(
    private readonly googleEngine: GoogleEngine,
    private readonly pageParserService: PageParserService,
  ) {}

  async search(query: string) {
    const requestKey = `/search?query=${query}`;

    const inProgressRequest = this.handleInProgressRequest(requestKey);

    if (inProgressRequest) return inProgressRequest;

    return this.performSearch(requestKey, query);
  }

  private async performSearch(requestKey: string, query: string): Promise<any> {
    const engines = {
      [SearchEngines.Google]: this.googleEngine,
    };

    // In the future we can use this approach for configuring search engine from client side.
    // Example: We can create pop up where user will select prefer search engine
    const searchEngine = engines[SearchEngines.Google];

    const searchPromise = searchEngine
      .search(query)
      .then(async (searchResult: SearchItem[]) => {
        if (!searchResult) throw new NotFoundException('No information found');

        const mainResponse = await this.generateMainResponse(searchResult);

        let defaultResponse = this.generateDefaultResponse(searchResult);

        if (mainResponse)
          defaultResponse = defaultResponse.filter(
            (item) => item.link !== mainResponse.link,
          );

        await delay(2000);

        this.inProgressRequests.delete(requestKey);

        return {
          main: mainResponse,
          defaultResponse,
        };
      })
      .catch((err) => {
        this.inProgressRequests.delete(requestKey);
        throw err;
      });

    this.inProgressRequests.set(requestKey, searchPromise);

    return searchPromise;
  }

  private handleInProgressRequest(requestKey: string): Promise<any> | null {
    if (this.inProgressRequests.has(requestKey)) {
      return this.inProgressRequests.get(requestKey);
    }
    return null;
  }

  private async generateMainResponse(searchResult: SearchItem[]) {
    const keyWord = 'wikipedia';

    const mainResult = searchResult.find((item) => item.link.includes(keyWord));

    if (!mainResult) return null;

    const pageContent = await this.pageParserService.grabMainContent(
      mainResult.link,
    );

    return {
      link: mainResult.link,
      image: mainResult.image ?? pageContent.image,
      content: pageContent.text,
    };
  }

  private generateDefaultResponse(searchResult: SearchItem[]) {
    return searchResult.map((result) => ({
      link: result.link,
      title: result.title,
    }));
  }
}
