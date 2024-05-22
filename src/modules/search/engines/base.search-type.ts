import { SearchItem } from '../types/result.type';

export interface BaseSearchType {
  search(phrase: string): Promise<SearchItem[]>;
}

export enum SearchTypes {
  API,
  HTML,
}
