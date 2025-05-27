import jwt from "jsonwebtoken";
import StatusCode from "../config/StatusCode";
const JWT_key = process.env.JWT_key || 'hello_key';
export const userOnly = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "No token provided, access denied"
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!JWT_key) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                message: "JWT_SECRET is not configured on the server"
            });
            return;
        }
        const decoded = jwt.verify(token, JWT_key);
        const { id, role } = decoded;
        if (!id || !role) {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Invalid token payload"
            });
            return;
        }
        req.user = { id, role };
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Token has expired"
            });
        }
        else if (error.name === 'JsonWebTokenError') {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Invalid token"
            });
        }
        else {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Token verification failed"
            });
        }
    }
};
export const adminOnly = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "No token provided, access denied"
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!JWT_key) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                message: "JWT_SECRET is not configured on the server"
            });
            return;
        }
        const decoded = jwt.verify(token, JWT_key);
        const { id, role } = decoded;
        if (!id || role !== 'admin') {
            res.status(StatusCode.FORBIDDEN).json({
                message: "Admin access required"
            });
            return;
        }
        req.admin = { id, role };
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Token has expired"
            });
        }
        else if (error.name === 'JsonWebTokenError') {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Invalid token"
            });
        }
        else {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Token verification failed"
            });
        }
    }
};
