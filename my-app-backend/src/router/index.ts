import { Router } from 'express';
import userRouter from './routes/user';
import moviesRouter from './routes/movies';

const router = Router();

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

export default router;
