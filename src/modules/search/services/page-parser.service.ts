import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GoogleSearchResult } from '../types/result.type';

@Injectable()
export class PageParserService {
  async grabMainContent(link: string): Promise<string> {
    const page = await axios.get(link);
    const pageContent = page.data;

    const startTag = '<p>';
    const endTag = '</p>';
    const startIndex = pageContent.indexOf(startTag);
    const endIndex = pageContent.indexOf(endTag, startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
      const content = pageContent.substring(
        startIndex + startTag.length,
        endIndex,
      );

      return content.trim();
    }

    return null;
  }

  grabMainImage(searchResult: GoogleSearchResult): string {
    const pageMap = searchResult.pagemap;
    return pageMap?.cse_image?.[0]?.src || pageMap.metatags?.[0]?.['og:image'];
  }

  generateDefaultResponse(searchResult: GoogleSearchResult[]) {
    return searchResult.map((result) => ({
      url: result.displayLink,
      title: result.htmlTitle,
    }));
  }
}
