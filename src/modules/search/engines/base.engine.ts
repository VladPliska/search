import { SearchItem } from '../types/result.type';

export interface BaseEngine {
  search(phrase: string): Promise<SearchItem[]>;
}
