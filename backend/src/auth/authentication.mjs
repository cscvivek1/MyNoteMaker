import jwt from 'jsonwebtoken';
import { secretToken } from '../../config.mjs';
import userModel from '../models/userModel.mjs';

export const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send({ status: 'failed', message: 'Please login to continue' });

    // verify token (throws on invalid)
    const decoded = jwt.verify(token, secretToken);

    // load user (without password) and attach minimal info
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) return res.status(401).send({ status: 'failed', message: 'User not found' });

    req.token = decoded;
    req.user = { id: user._id.toString(), role: user.role }; // plain object is safer
    next();
  } catch (err) {
    return res.status(401).send({ status: 'failed', message: err.message || err });
  }
};

export const authorization = async (req, res, next) => {
  try {
    if (req.user?.role === 'admin') return next();
    return res.status(403).send({ status: 'failed', message: 'authorization failed' });
  } catch (err) {
    return res.status(500).send({ status: 'failed', message: err.message || err });
  }
};
