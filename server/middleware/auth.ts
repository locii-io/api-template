import jwt from 'jsonwebtoken';

export const startsWithAny = (str, substrs) => {
  return substrs.some((substr) =>
    str.toLowerCase().startsWith(substr.toLowerCase()),
  );
};

export default function authenticateToken(req, res, next) {
  // IMPORTANT: The URLs put below won't require authentication
  // This will be changed when moved to Role based
  const skippedUrlPrefixes = ['/api-docs'];
  const skippedUrlExact = ['/api/user', '/api/login', '/graphql'];

  if (startsWithAny(req.originalUrl, skippedUrlPrefixes) || skippedUrlExact.includes(req.originalUrl)) {
    next();
  } else {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token && !jwt.verify(token, process.env.JWT_SECRET)) {
        return res.sendStatus(403);
      }
      next();
    } else {
      res.sendStatus(401);
    }
  }
}
