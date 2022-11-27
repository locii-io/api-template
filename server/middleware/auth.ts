import { verifyToken, startsWithAny } from '../utils/index';

export default async function authenticateToken(req, res, next) {
  // IMPORTANT: The URLs put below won't require authentication
  const skippedUrlPrefixes = ['/api-docs', '/api/create-user', '/login'];

  if (startsWithAny(req.originalUrl, skippedUrlPrefixes)) {
    next();
  } else {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token && !verifyToken(token)) {
        return res.sendStatus(403);
      }

      // Pass authenticated User ID
      const authUserId = verifyToken(token)['user_id'];
      res.locals = { authUserId: authUserId };

      next();
    } else {
      res.sendStatus(401);
    }
  }
}
