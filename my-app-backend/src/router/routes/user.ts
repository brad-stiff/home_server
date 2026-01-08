import { Router } from 'express';
import db from '../../db'

const router = Router();

// router.get('/') //get all users

// router.get('/:id') //get one

router.get('/user_levels', async (req, res) => {
  try {
    const user_levels = await db.user.getUserLevels();
    res.json(user_levels)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error'})
  }
});

export default router;
