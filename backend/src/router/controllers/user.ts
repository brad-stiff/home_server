import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import * as crypto from 'crypto';

import db from '../../db';
import config from '../../config';

import { AuthRequest } from '../middleware/auth';
import {
  validateRegister,
  validateLogin,
  validateProfilePicture,
  validateFirstName,
  validateLastName,
  validatePasswordUpdate
} from '../validators/user';

const REFRESH_TOKEN_EXPIRY_DAYS = 30;

function createRefreshTokenValue() {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

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
      const found_users = await db.user.getUsers({ email_search_str: email, exact_match: 1 });

      if (existing_user_password_hash.length === 0 || !found_users || found_users.length !== 1) {
        return res.status(400).json({ errors: ['Cannot find user'] });
      }
      if (await bcrypt.compare(password, existing_user_password_hash[0].password_hash)) {
        const logged_in_user = found_users[0];

        const access_token = jwt.sign(
          { id: logged_in_user.id, email: logged_in_user.email },
          config.app.access_token_secret,
          { expiresIn: '15m' }
        );

        const refresh_token_id = crypto.randomUUID();
        const refresh_token_value = createRefreshTokenValue();
        const refresh_token_hash = hashToken(refresh_token_value);

        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

        await db.user.insertUserRefreshToken({
          id: refresh_token_id,
          user_id: logged_in_user.id,
          token_hash: refresh_token_hash,
          expires_at
        });

        const refresh_token = `${refresh_token_id}.${refresh_token_value}`;

        return res.status(200).json({
          messages: ['Success!', access_token],
          access_token,
          refresh_token
        });
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

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body as { refresh_token?: string };

      if (!refresh_token || typeof refresh_token !== 'string') {
        return res.status(400).json({ error: 'refresh_token is required' });
      }

      const parts = refresh_token.split('.');
      if (parts.length !== 2) {
        return res.status(400).json({ error: 'Invalid refresh token format' });
      }

      const [token_id, token_value] = parts;

      const tokens = await db.user.getUserRefreshTokenById(token_id);

      if (!tokens || tokens.length === 0) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const stored_token = tokens[0];

      if (stored_token.revoked_at) {
        return res.status(401).json({ error: 'Refresh token has been revoked' });
      }

      const now = new Date();
      if (stored_token.expires_at <= now) {
        return res.status(401).json({ error: 'Refresh token has expired' });
      }

      const computed_hash = hashToken(token_value);
      if (computed_hash !== stored_token.token_hash) {
        await db.user.revokeAllUserRefreshTokensForUser(stored_token.user_id);
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const found_users = await db.user.getUser(stored_token.user_id);

      if (!found_users || found_users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = found_users[0];

      const access_token = jwt.sign(
        { id: user.id, email: user.email },
        config.app.access_token_secret,
        { expiresIn: '15m' }
      );

      const new_refresh_token_id = crypto.randomUUID();
      const new_refresh_token_value = createRefreshTokenValue();
      const new_refresh_token_hash = hashToken(new_refresh_token_value);

      const new_expires_at = new Date();
      new_expires_at.setDate(new_expires_at.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

      await db.user.insertUserRefreshToken({
        id: new_refresh_token_id,
        user_id: user.id,
        token_hash: new_refresh_token_hash,
        expires_at: new_expires_at
      });

      await db.user.revokeUserRefreshTokenAndSetReplacedBy({
        id: stored_token.id,
        replaced_by: new_refresh_token_id
      });

      const new_refresh_token = `${new_refresh_token_id}.${new_refresh_token_value}`;

      return res.status(200).json({
        access_token,
        refresh_token: new_refresh_token
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body as { refresh_token?: string };

      if (!refresh_token || typeof refresh_token !== 'string') {
        return res.status(400).json({ error: 'refresh_token is required' });
      }

      const parts = refresh_token.split('.');
      if (parts.length !== 2) {
        return res.status(400).json({ error: 'Invalid refresh token format' });
      }

      const [token_id] = parts;

      const tokens = await db.user.getUserRefreshTokenById(token_id);

      if (!tokens || tokens.length === 0) {
        // Idempotent logout – nothing to revoke
        return res.status(200).json({ success: true });
      }

      await db.user.revokeUserRefreshToken(token_id);

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
