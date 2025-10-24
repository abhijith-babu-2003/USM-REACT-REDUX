import Users from "../../models/UserSchema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import StatusCode from "../../config/StatusCode";
const JWT_key = process.env.JWT_key || 'hello_key';
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Users.findOne({ email });
        if (!admin) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "The user with this email not exist" });
            return;
        }
        if (admin.role !== "admin") {
            res.status(StatusCode.BAD_REQUEST).json({ message: "This user is not an admin" });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "The password is incorrect" });
            return;
        }
        const token = jwt.sign({
            id: admin._id,
            role: admin.role
        }, JWT_key, { expiresIn: "1h" });
        res.json({ message: "Login Successful", token, admin });
    }
    catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await Users.find({ role: "user" });
        res.status(StatusCode.OK).json({ users: users });
    }
    catch (error) {
        console.error("Error Fetching users:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch users data" });
    }
};
export const createUser = async (req, res) => {
    try {
        const { name, email, phone, password, profileImage } = req.body;
        if (!name || !email || !phone || !password || !profileImage) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "All fields are required" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            name,
            email,
            phone,
            password: hashedPassword,
            profileImage: profileImage || '',
            role: 'user'
        });
        await newUser.save();
        res.status(StatusCode.OK).json({ message: "The user created successfully" });
        return;
    }
    catch (error) {
        console.log("There is error in creating user");
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "internal server error" });
    }
};
export const updateUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, profileImage } = req.body;
        const updatedUser = await Users.findByIdAndUpdate(id, { name, email, phone, profileImage }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(StatusCode.NOT_FOUND).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Error in Updating user", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findByIdAndDelete(id);
        if (!user) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "The User has been deleted Successfully" });
            return;
        }
        res.status(StatusCode.OK).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleting user", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
