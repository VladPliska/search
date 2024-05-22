import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class PageParserService {
  async grabMainContent(
    link: string,
  ): Promise<{ text: string; image: string }> {
    const page = await axios.get(link);
    const pageContent = page.data;

    const startTag = '<p>';
    const endTag = '</p>';
    const startIndex = pageContent.indexOf(startTag);
    const endIndex = pageContent.indexOf(endTag, startIndex);

    const image = this.getWikiImageFromHtml(pageContent);
    let text;

    if (startIndex !== -1 && endIndex !== -1) {
      const content = pageContent.substring(
        startIndex + startTag.length,
        endIndex,
      );

      text = content.trim();
    }

    return {
      text,
      image,
    };
  }

  private getWikiImageFromHtml(html: string) {
    const $ = cheerio.load(html);

    const images = $('#content figure');

    const mainImage = images?.[0];

    if (!mainImage) return null;

    const imageUrl = $(mainImage).find('img').attr('src');

    return `https:${imageUrl}`;
  }
}
