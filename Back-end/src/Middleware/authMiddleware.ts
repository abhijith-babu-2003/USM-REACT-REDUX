import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import StatusCode from "../config/StatusCode";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
  admin?: { id: string; role: string };
}

const JWT_key = process.env.JWT_key as string || 'hello_key';


export const userOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decoded = jwt.verify(token, JWT_key) as JwtPayload & {
      id: string;
      role: string;
    };

    const { id, role } = decoded;

    if (!id || !role) {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Invalid token payload" 
      });
      return;
    }

    req.user = { id, role };
    next();
    
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Token has expired" 
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Invalid token" 
      });
    } else {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Token verification failed" 
      });
    }
  }
};

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const decoded = jwt.verify(token, JWT_key) as JwtPayload & {
      id: string;
      role: string;
    };

    const { id, role } = decoded;

    if (!id || role !== 'admin') {
      res.status(StatusCode.FORBIDDEN).json({ 
        message: "Admin access required" 
      });
      return;
    }

    req.admin = { id, role };
    next();
    
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Token has expired" 
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Invalid token" 
      });
    } else {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Token verification failed" 
      });
    }
  }
};