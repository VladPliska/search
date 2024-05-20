import axios from 'axios';
import { BaseEngine } from './base.engine';
import { Injectable } from '@nestjs/common';
import { GoogleSearchResult } from '../types/result.type';

@Injectable()
export class GoogleEngine implements BaseEngine {
  private readonly apiKey = process.env.GOOGLE_API_KEY;
  private readonly customSearchId = process.env.GOOGLE_CUSTOM_SEARCH_ID;

  async search(phrase: string): Promise<GoogleSearchResult[]> {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(phrase)}&cx=${this.customSearchId}&key=${this.apiKey}`;

    try {
      const response = await axios.get(url);

      return response.data?.items;
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  }
}
