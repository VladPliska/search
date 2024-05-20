import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleEngine } from '../engines/google.engine';
import { GoogleSearchResult } from '../types/result.type';
import { delay } from '../../../utils';
import { SearchEngines } from '../types/engine.type';
import { PageParserService } from './page-parser.service';

@Injectable()
export class SearchService {
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
      .then(async (searchResult) => {
        if (!searchResult) throw new NotFoundException('No information found');

        const mainResponse = await this.generateMainResponse(searchResult);
        let defaultResponse =
          this.pageParserService.generateDefaultResponse(searchResult);

        if (mainResponse)
          defaultResponse = defaultResponse.filter(
            (item) => item.url !== mainResponse.url,
          );

        await delay(5000);

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

  private async generateMainResponse(searchResult: GoogleSearchResult[]) {
    const keyWord = 'wikipedia';

    const mainResult = searchResult.find((item) =>
      item.displayLink.includes(keyWord),
    );

    if (!mainResult) return null;

    const pageImage = this.pageParserService.grabMainImage(mainResult);
    const pageContent = await this.pageParserService.grabMainContent(
      mainResult.link,
    );

    return {
      url: mainResult.displayLink,
      image: pageImage,
      content: pageContent,
    };
  }
}
