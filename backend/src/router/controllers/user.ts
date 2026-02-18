import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sharp from 'sharp';

import db from '../../db'
import config from '../../config'

import { AuthRequest } from '../middleware/auth';
import {
  validateRegister,
  validateLogin,
  validateProfilePicture,
  validateFirstName,
  validateLastName,
  validatePasswordUpdate
} from '../validators/user'

export class UserController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user_id = req.user.id;

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

  async updateProfilePicture(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user_id = req.user.id;
      //vlidation on image
      const validation = validateProfilePicture(req.body);
      if ('errors' in validation) {
        return res.status(400).json({ errors: validation.errors });
      }

      const { image_base64 } = validation.data;

      if (!image_base64) {
        return res.status(400).json({ success: false, message: 'No image provided' });
      }

      const image_buffer = Buffer.from(image_base64, 'base64');

      const resized = await sharp(image_buffer)
        .resize(256, 256)
        .jpeg({ quality: 80 })
        .toBuffer();

      await db.user.updateUserAvatar({ user_id: user_id, image_buffer: resized});

      return res.json({ success: true, message: 'Profile picture updated' });
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
      const response = await db.user.insertUser(new_user_request);
      res.json(response)
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateLogin(req.body);
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

  async updateFirstName(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user_id = req.user.id;

      const validation = validateFirstName(req.body);
      if ('errors' in validation) {
        return res.status(400).json({ errors: validation.errors });
      }

      const { first_name } = validation.data;

      await db.user.updateUserFirstName({ user_id, name: first_name });

      return res.json({ success: true, message: 'First name updated' });
    } catch (error) {
      next(error);
    }
  }

  async updateLastName(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user_id = req.user.id;

      const validation = validateLastName(req.body);
      if ('errors' in validation) {
        return res.status(400).json({ errors: validation.errors });
      }

      const { last_name } = validation.data;

      await db.user.updateUserLastName({ user_id, name: last_name });

      return res.json({ success: true, message: 'Last name updated' });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user_id = req.user.id;

      const validation = validatePasswordUpdate(req.body);
      if ('errors' in validation) {
        return res.status(400).json({ errors: validation.errors });
      }

      const { current_password, new_password } = validation.data;

      // Get current user to verify current password
      const found_users = await db.user.getUser(user_id);
      if (!found_users || found_users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = found_users[0];

      // Get current password hash
      const password_hash_result = await db.user.getUserPasswordHash(user.email);
      if (password_hash_result.length === 0) {
        return res.status(400).json({ errors: ['Cannot verify current password'] });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        current_password,
        password_hash_result[0].password_hash
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({ errors: ['Current password is incorrect'] });
      }

      // Hash new password
      const new_password_hash = await bcrypt.hash(new_password, 12);

      // Update password
      await db.user.updateUserPassword({
        user_id,
        password_hash: new_password_hash,
      });

      return res.json({ success: true, message: 'Password updated' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
