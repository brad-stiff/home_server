import db from '../../db'
import { Request, Response, NextFunction } from 'express';
import ScryfallService from '../../services/scryfall';

import {
  validateCardsBySet,
  validateCardById,
  validateUpdateCardCount
} from '../validators/cards';

export class CardsController {
  async getUserLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user_cards = await db.cards.getCards({});

      res.json({
        success: true,
        data: user_cards
      })
    } catch (error) {
      console.error('Error in getUserLibrary', error);
      next(error);
    }
  }

  async getSets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sets_data = await ScryfallService.getAllSets();

      res.json({
        success: true,
        data: sets_data
      });
    } catch (error) {
      console.error('Error in getSets:', error);
      next(error);
    }
  }

  async getCardsBySet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCardsBySet(req.params);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { set_code } = validation.data;

      const results = await ScryfallService.getCardsBySet(set_code);
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getCardsBySet:', error);
      next(error);
    }
  }

  async getCardById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCardById(req.params);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const { scryfall_card_id } = validation.data;

      const results = await ScryfallService.getCardById(scryfall_card_id);
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in getCardById', error);
      next(error);
    }
  }

  async updateCardCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateUpdateCardCount(req.body);
      if ('errors' in validation) {
        res.status(400).json({ errors: validation.errors });
        return;
      }

      const { scryfall_id, count, is_foil } = validation.data;

      // Check if card already exists in our library
      const existingCards = await db.cards.getCards({ scryfall_ids: [scryfall_id] });
      let card = existingCards[0];

      if (!card) {
        // Fetch card details from Scryfall if we haven't seen this card before
        const scryfallCard = await ScryfallService.getCardById(scryfall_id);
        card = {
          id: 0, // ignored by upsert (id is AUTO_INCREMENT in DB)
          scryfall_id,
          scryfall_data: scryfallCard,
          name: scryfallCard.name,
          non_foil_count: 0,
          foil_count: 0
        };
      }

      // Apply count update, clamped at 0 for UNSIGNED columns
      const updatedNonFoil = card.non_foil_count + (is_foil ? 0 : count);
      const updatedFoil = card.foil_count + (is_foil ? count : 0);

      const updatedCard = {
        ...card,
        non_foil_count: Math.max(0, updatedNonFoil),
        foil_count: Math.max(0, updatedFoil)
      };

      await db.cards.upsertCard(updatedCard);

      // Re-fetch from DB to get canonical data (including generated id)
      const savedCards = await db.cards.getCards({ scryfall_ids: [scryfall_id] });
      const savedCard = savedCards[0] ?? updatedCard;

      res.json({
        success: true,
        data: savedCard
      });
    } catch (error) {
      console.error('Error in updateCardCount', error);
      next(error);
    }
  }
}

export default new CardsController();
