import { Request, Response } from "express";
import Users from "../../models/UserSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import StatusCode from "../../config/StatusCode";

dotenv.config();

const JWT_key = process.env.JWT_key as string || 'hello_key';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, password, image } = req.body;
  
  try {
    let user = await Users.findOne({ email });
    if (user) {
      res.status(StatusCode.BAD_REQUEST).json({ 
        message: "User already exists with this email" 
      });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = new Users({
      name,
      email,
      password: hashPassword,
      profileImage: image || "",
      phone,
    });

    await user.save();
    
    res.status(StatusCode.CREATED).json({ 
      message: "User registered successfully",
      success: true 
    });
    
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
      message: "Server error during registration" 
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(StatusCode.BAD_REQUEST).json({ 
        message: "User with this email does not exist" 
      });
      return;
    }

    // Check if user is blocked
    if (user.isBlocked) {
      res.status(StatusCode.FORBIDDEN).json({ 
        message: "Your account has been blocked. Please contact support." 
      });
      return;
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(StatusCode.BAD_REQUEST).json({ 
        message: "Incorrect password" 
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_key,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role
    };

    res.status(StatusCode.OK).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error: any) {
    console.error("Login error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
      message: "Server error during login" 
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {  
  try {
    if (!req.user) {
      
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Unauthorized access" 
      });
      return;
    }
    console.log("update user invoked");

    const userId = req.user.id;
    const { name, email, phone, profileImage } = req.body;

  
    const user = await Users.findById(userId);
    if (!user) {
      res.status(StatusCode.NOT_FOUND).json({ 
        message: "User not found" 
      });
      return;
    }

    if (email && email !== user.email) {
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        res.status(StatusCode.BAD_REQUEST).json({ 
          message: "Email already exists" 
        });
        return;
      }
    }

   
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.profileImage = profileImage || user.profileImage;

    const updatedUser = await user.save();

  
    const userData = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profileImage: updatedUser.profileImage,
      role: updatedUser.role
    };

    res.status(StatusCode.OK).json({
      message: "User updated successfully",
      user: userData
    });

  } catch (error: any) {
    console.error("Update user error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
      message: "Server error during update" 
    });
  }
};