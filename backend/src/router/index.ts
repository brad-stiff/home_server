import { Router } from 'express';
import userRouter from './routes/user';
import moviesRouter from './routes/movies';
import cardsRouter from './routes/cards';

const router = Router();

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use('/cards', cardsRouter);

export default router;
