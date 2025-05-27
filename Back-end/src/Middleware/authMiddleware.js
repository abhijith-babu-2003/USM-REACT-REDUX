"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.userOnly = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StatusCode_1 = __importDefault(require("../config/StatusCode"));
const JWT_key = "your_jwt_secret";
const userOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    console.log(token);
    if (!token) {
        res
            .status(StatusCode_1.default.UNAUTHORIZED)
            .json({ message: "No token provided,access denined" });
        return;
    }
    if (!JWT_key) {
        res
            .status(StatusCode_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: "JWT_SECRET is not configured on the server" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_key);
        console.log("decoded token", decoded);
        const { id, role } = decoded;
        if (!id || !role) {
            res
                .status(StatusCode_1.default.UNAUTHORIZED)
                .json({ message: "Invalid token payload" });
            return;
        }
        req.user = {
            id,
            role,
        };
        next();
    }
    catch (error) {
        res
            .status(StatusCode_1.default.UNAUTHORIZED)
            .json({ message: "Invalid or expired token" });
    }
});
exports.userOnly = userOnly;
const adminOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res
            .status(StatusCode_1.default.UNAUTHORIZED)
            .json({ message: "No token provided, access denied" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_key);
        const { id, role } = decoded;
        if (!id || !role) {
            res
                .status(StatusCode_1.default.FORBIDDEN)
                .json({ message: "Admin access required" });
            return;
        }
        req.admin = {
            id,
            role,
        };
        next();
    }
    catch (error) {
        res
            .status(StatusCode_1.default.UNAUTHORIZED)
            .json({ message: "Invalid or expired token" });
        return;
    }
});
exports.adminOnly = adminOnly;
