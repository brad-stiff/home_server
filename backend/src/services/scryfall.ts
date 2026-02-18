import axios, { AxiosResponse } from 'axios';

import type {
  SetResponse,
  SetCardsResponse,
  MTGCard,
  CardSetResponse
} from '../types/card'

const SCRYFALL_BASE_URL = 'https://api.scryfall.com';

class ScryfallService {
  private api = axios.create({
    baseURL: SCRYFALL_BASE_URL
  });

  async getAllSets(): Promise<SetResponse> {
    try {
      const response: AxiosResponse<SetResponse> = await this.api.get('/sets');
      return response.data;
    } catch (error) {
      console.error('Error fetching sets:', error);
      throw new Error('Failed to fetch sets');
    }
  }

  async getCardsBySet(set_code: string): Promise<CardSetResponse> {
    try {
      let url = `/cards/search?q=set:${set_code}`;
      let has_more = true;
      let set_card_count = 0;
      let set_cards: MTGCard[] = [];

      while (has_more) {
        const response: AxiosResponse<SetCardsResponse> = await this.api.get(url);

        set_cards.push(...response.data.data);

        set_card_count = response.data.total_cards;
        has_more = response.data.has_more;

        url = response.data.next_page;
      }

      return {
        set_card_count: set_card_count,
        cards: set_cards
      }
    } catch (error) {
      console.error('Error fetching cards by set:', error);
      throw new Error('Failed to fetch cards by set');
    }
  }

  async getCardById(scryfall_card_id: string): Promise<MTGCard> {
    try {
      const response: AxiosResponse<MTGCard> = await this.api.get(`/cards/${scryfall_card_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching card:', error);
      throw new Error('Failed to fetch card');
    }
  }
}

export default new ScryfallService();
