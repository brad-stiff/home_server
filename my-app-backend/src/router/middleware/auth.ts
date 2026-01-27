import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import config from '../../config'

export interface AuthRequest extends Request {
  user?: { id: number }
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const auth_header = req.headers['authorization']
  const token = auth_header && auth_header.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  jwt.verify(token, config.app.access_token_secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    console.log('auth token function', user);
    req.user = { id: user.id };
    next();
  });
}
