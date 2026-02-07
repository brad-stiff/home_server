import { Router } from 'express';
import mtgCardsController from '../controllers/mtgCards';

const router = Router();

// Get all sets with icons
router.get('/sets', mtgCardsController.getSets);

// Search for cards
router.get('/search', mtgCardsController.searchCards);

// Get cards by set code
router.get('/sets/:setCode/cards', mtgCardsController.getCardsBySet);

export default router;

