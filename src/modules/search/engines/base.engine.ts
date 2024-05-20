export interface BaseEngine {
  search(phrase: string): Promise<any>;
}
