import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized', success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.id };
    next();
  } catch (error) {
    return res.status(403).json({ message: error.message, success: false });
  }
};

export default userAuth;
