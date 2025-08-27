import jwt from 'jsonwebtoken';
import { secretToken } from '../../config.mjs';
import userModel from '../models/userModel.mjs';

const authentication = async (req, res, next) => {
    try {
        const header = req.headers;
        const token = header.authorization && header.authorization.split(" ")[1] || false;
        // console.log(token);
        if (!token) {
            return res.status(400).send({ status: "failed", message: "please login to continue" });
        }
        jwt.verify(token, secretToken, async (err, decoded) => {
            if (err) {
                return res.status(401).send({ status: "failed", message: err });
            } else {
                req.token = decoded;
                // Fetch user information and set it in req.user
                try {
                    const user = await userModel.findById(decoded.id);
                    if (!user) {
                        return res.status(401).send({ status: "failed", message: "User not found" });
                    }
                    req.user = user;
                    next();
                } catch (userError) {
                    return res.status(500).send({ status: "failed", message: "Error fetching user information" });
                }
            }
        })
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else {
            return res.status(500).send({ status: "failed", message: error.message });
        }
    }
}

const authorization = async (req, res, next) => {
    try {
        const token = req.token;
        const user = await userModel.findById(token.id);
        if (user.role === "admin") {
            next();
        } else {
            return res.status(403).send({ status: "failed", message: "authorization failed" });
        }
        // console.log(token);
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else {
            return res.status(500).send({ status: "failed", message: error.message });
        }
    }
}

export { authentication, authorization }