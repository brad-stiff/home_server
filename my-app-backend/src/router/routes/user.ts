import { Router } from 'express';
import db from '../../db'
import bcrypt from 'bcrypt'
import { validateRegister } from '../../validators/user'

import jwt from 'jsonwebtoken'

import config from '../../config'

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

router.post('/register', async (req, res, next) => {
  try {
    const validation = validateRegister(req.body);
    if ('errors' in validation) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { email, password } = validation.data;

    const existing_user = await db.user.getUsers({ email_search_str: email, exact_match: 1 });
    if (existing_user.length > 0) {
      return res.status(400).json({ errors: ['Email already in use'] });
    }

    //const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, 12); //salt); //can just write 12 instead of salt

    const new_user_request = {
      email,
      password_hash: hash
    };
    //await insert
    const response = await db.user.insertUser(new_user_request);
    //delete password
    res.json(response)

  } catch (error) {
    next(error);
  }
});

//what happens if already logged in?
router.post('/login', async (req, res, next) => {
  try {
    const validation = validateRegister(req.body);
    if ('errors' in validation) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { email, password } = validation.data;

    const existing_user_password_hash = await db.user.getUserPasswordHash(email);
    if (existing_user_password_hash.length === 0) {
      return res.status(400).json({ errors: ['Cannot find user'] });
    }
    if (await bcrypt.compare(password, existing_user_password_hash[0].password_hash)) {
      const access_token = jwt.sign({ email: email}, config.app.access_token_secret)
      return res.status(200).json({ messages: ['Success!', access_token] });
    } else {
      return res.status(400).json({ errors: ['Incorrect credentials'] });
    }
  } catch (error) {
    next(error);
  }
})

function authenticateToken(req, res, next) {
  const auth_header = req.headers['authorization']
  const token = auth_header && auth_header.split(' ')[1]
}

export default router;
