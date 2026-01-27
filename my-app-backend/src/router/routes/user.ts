import { Router } from 'express';
import db from '../../db'
import bcrypt from 'bcrypt'
import { validateRegister } from '../../validators/user'

import { authenticateToken, AuthRequest } from '../middleware/auth';

import jwt from 'jsonwebtoken'

import config from '../../config'

const router = Router();

// router.get('/') //get all users

router.get('/me', authenticateToken, async(req: AuthRequest, res, next) => {
  try {
    console.log(req.user);
    const user_id = req.user!.id;
    console.log('/me user id', user_id, req.user)

    const found_users = await db.user.getUser(user_id);
    console.log('found_users', found_users);

    if (!found_users || found_users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = found_users[0];
    return res.status(200).json({ user });

  } catch (error) {
    next(error);
  }
})

// router.get('/:id') //get one
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const found_users = await db.user.getUser(Number(id))

    if (found_users.length !== 1) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user: found_users[0] });

  } catch (error) {
    next(error);
  }
});

router.get('/user_levels', async (req, res, next) => {
  try {
    const user_levels = await db.user.getUserLevels();
    res.status(200).json(user_levels)
  } catch (error) {
    next(error);
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

router.post('/login', async (req, res, next) => {
  try {
    const validation = validateRegister(req.body);
    if ('errors' in validation) {
      return res.status(400).json({ errors: validation.errors });
    }

    const { email, password } = validation.data;

    const existing_user_password_hash = await db.user.getUserPasswordHash(email);
    const found_users = await db.user.getUsers({ email_search_str: email, exact_match: 1})
    console.log('found users', found_users)
    if (existing_user_password_hash.length === 0 || !found_users ||found_users.length !== 1) {
      return res.status(400).json({ errors: ['Cannot find user'] });
    }
    if (await bcrypt.compare(password, existing_user_password_hash[0].password_hash)) {
      const logged_in_user = found_users[0]
      console.log('logged_in_user', logged_in_user)
      const access_token = jwt.sign({ id: logged_in_user.id, email: logged_in_user.email}, config.app.access_token_secret)
      return res.status(200).json({ messages: ['Success!', access_token] }); //change object shape
    } else {
      return res.status(400).json({ errors: ['Incorrect credentials'] });
    }
  } catch (error) {
    next(error);
  }
})

//logout
//FUTURE - will be needed when implementing refresh tokens

export default router;
