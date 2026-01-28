import { Router } from 'express';

import { authenticateToken } from '../middleware/auth';

import userController from '../controllers/user';

const router = Router();

router.get('/me', authenticateToken, userController.getMe);

router.get('/user_levels', userController.getUserLevels);

router.post('/register', userController.register);

router.post('/login', userController.login);

//logout
//FUTURE - will be needed when implementing refresh tokens

router.get('/:id', userController.getUser);

// router.get('/') //get all users

export default router;
