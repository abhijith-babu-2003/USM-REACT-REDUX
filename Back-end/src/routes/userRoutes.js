"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../Controllers/user/UserController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/signup", UserController_1.registerUser);
router.post('/login', UserController_1.loginUser);
router.put('/updateProfile', authMiddleware_1.userOnly, UserController_1.updateUser);
exports.default = router;
