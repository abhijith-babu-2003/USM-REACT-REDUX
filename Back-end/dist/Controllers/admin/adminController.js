import Users from "../../models/UserSchema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { updateUser } from "../user/UserController";
const JWT_key = process.env.JWT_key || 'hello_key';
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Users.findOne({ email });
        if (!admin) {
            res.status(400).json({ message: "The user with this email not exist" });
            return;
        }
        if (admin.role !== "admin") {
            res.status(400).json({ message: "This user is not an admin" });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            res.status(400).json({ message: "The password is incorrect" });
            return;
        }
        const token = jwt.sign({
            id: admin._id,
            role: admin.role
        }, JWT_key, { expiresIn: "1h" });
        res.json({ message: "Login Successful", token, admin });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await Users.find({ role: "user" });
        res.status(200).json({ users: users });
    }
    catch (error) {
        console.error("Error Fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users data" });
    }
};
export const createUser = async (req, res) => {
    try {
        const { name, email, phone, password, profileImage } = req.body;
        if (!name || !email || !phone || !password || !profileImage) {
            res.status(401).json({ message: "All fields are required" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            name,
            email,
            phone,
            password: hashedPassword,
            profileImage
        });
        console.log("newUser", newUser);
        await newUser.save();
        res.status(200).json({ message: "The user created successfully" });
        return;
    }
    catch (error) {
        console.log("There is error in creating user");
        res.status(500).json({ message: "internal server error" });
    }
};
export const updateUsers = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const { name, email, phone, profileImage } = req.body;
        console.log(req.body);
        const updatedUser = await Users.findByIdAndUpdate(id, { name, email, phone, profileImage }, { new: true, runValidators: true });
        console.log(updateUser);
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Error in Updating user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("userID", id);
        const user = await Users.findByIdAndDelete(id);
        if (!user) {
            res.status(400).json({ message: "The User has been deleted Successfully" });
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleting user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
