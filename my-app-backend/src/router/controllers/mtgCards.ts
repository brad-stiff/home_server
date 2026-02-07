import { Request, Response, NextFunction } from 'express';
import ScryfallService from '../../services/scryfall';

export class MtgCardsController {
  /**
   * Get all sets with their icons
   */
  async getSets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sets_data = await ScryfallService.getAllSets();

      res.json({
        success: true,
        data: sets_data,
      });
    } catch (error) {
      console.error('Error in getSets:', error);
      next(error);
    }
  }

  /**
   * Search for cards
   */
  async searchCards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q: query, page = 1 } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          error: 'Query parameter is required',
        });
        return;
      }

      const page_number = parseInt(page as string, 10) || 1;
      const results = await ScryfallService.searchCards(query, page_number);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('Error in searchCards:', error);
      next(error);
    }
  }

  /**
   * Get cards by set code
   */
  async getCardsBySet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { setCode } = req.params;
      const { page = 1 } = req.query;

      if (!setCode || typeof setCode !== 'string') {
        res.status(400).json({
          error: 'Set code parameter is required',
        });
        return;
      }

      const page_number = parseInt(page as string, 10) || 1;
      const results = await ScryfallService.getCardsBySet(setCode, page_number);

      // Sort by collector_number if data exists
      if (results.data && Array.isArray(results.data)) {
        results.data.sort((a: any, b: any) => {
          const aNum = parseInt(a.collector_number || '0', 10);
          const bNum = parseInt(b.collector_number || '0', 10);
          return aNum - bNum;
        });
      }

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('Error in getCardsBySet:', error);
      next(error);
    }
  }
}

export default new MtgCardsController();

