import axios, { AxiosResponse } from 'axios';

const SCRYFALL_BASE_URL = 'https://api.scryfall.com';

class ScryfallService {
  private api = axios.create({
    baseURL: SCRYFALL_BASE_URL,
  });

  /**
   * Get all sets with their icons
   */
  async getAllSets(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.get('/sets');
      return response.data;
    } catch (error) {
      console.error('Error fetching sets:', error);
      throw new Error('Failed to fetch sets');
    }
  }

  /**
   * Search for cards by query
   */
  async searchCards(query: string, page: number = 1): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.get('/cards/search', {
        params: {
          q: query,
          page,
        },
      });
      return response.data;
    } catch (error: any) {
      // Scryfall returns 404 when no results found, which is not really an error
      if (error.response?.status === 404) {
        return {
          object: 'list',
          total_cards: 0,
          has_more: false,
          data: [],
        };
      }
      console.error('Error searching cards:', error);
      throw new Error('Failed to search cards');
    }
  }

  /**
   * Get cards by set code
   */
  async getCardsBySet(setCode: string, page: number = 1): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.get('/cards/search', {
        params: {
          q: `set:${setCode}`,
          page,
        },
      });
      return response.data;
    } catch (error: any) {
      // Scryfall returns 404 when no results found, which is not really an error
      if (error.response?.status === 404) {
        return {
          object: 'list',
          total_cards: 0,
          has_more: false,
          data: [],
        };
      }
      console.error('Error fetching cards by set:', error);
      throw new Error('Failed to fetch cards by set');
    }
  }
}

export default new ScryfallService();

