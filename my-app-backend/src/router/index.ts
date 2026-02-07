import { Router } from 'express';
import userRouter from './routes/user';
import moviesRouter from './routes/movies';
import mtgCardsRouter from './routes/mtgCards';

const router = Router();

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use('/mtg-cards', mtgCardsRouter);

export default router;
