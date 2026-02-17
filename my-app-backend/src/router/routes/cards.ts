import { Router } from 'express';
import cardsController from '../controllers/cards';

const router = Router();

router.get('/sets', cardsController.getSets);

router.get('/sets/:set_code/cards', cardsController.getCardsBySet);

router.get('/library', cardsController.getUserLibrary);

router.post('/library', cardsController.updateCardCount);

router.get('/:scryfall_card_id', cardsController.getCardById);

export default router;
