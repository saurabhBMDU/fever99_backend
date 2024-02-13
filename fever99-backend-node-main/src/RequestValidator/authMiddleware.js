import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECREAT_KEY);
    req.user = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};
export default authMiddleware

// module.exports = validateToken;
