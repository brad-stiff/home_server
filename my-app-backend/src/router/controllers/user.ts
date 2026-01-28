import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from '../../db'
import config from '../../config'

import { AuthRequest } from '../middleware/auth';
import { validateRegister } from '../validators/user'

export class UserController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user_id = req.user!.id;

      const found_users = await db.user.getUser(user_id);
      if (!found_users || found_users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = found_users[0];
      return res.status(200).json({ user });

    } catch (error) {
      next(error);
    }
  }

  async getUserLevels(req: Request, res: Response, next: NextFunction) {
    try {
      const user_levels = await db.user.getUserLevels();
      res.status(200).json(user_levels)
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
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

      const hash = await bcrypt.hash(password, 12);

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
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateRegister(req.body);
      if ('errors' in validation) {
        return res.status(400).json({ errors: validation.errors });
      }

      const { email, password } = validation.data;

      const existing_user_password_hash = await db.user.getUserPasswordHash(email);
      const found_users = await db.user.getUsers({ email_search_str: email, exact_match: 1})

      if (existing_user_password_hash.length === 0 || !found_users ||found_users.length !== 1) {
        return res.status(400).json({ errors: ['Cannot find user'] });
      }
      if (await bcrypt.compare(password, existing_user_password_hash[0].password_hash)) {
        const logged_in_user = found_users[0]
        const access_token = jwt.sign({ id: logged_in_user.id, email: logged_in_user.email}, config.app.access_token_secret)
        return res.status(200).json({ messages: ['Success!', access_token] }); //change object shape
      } else {
        return res.status(400).json({ errors: ['Incorrect credentials'] });
      }
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
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
  }
}

export default new UserController();
