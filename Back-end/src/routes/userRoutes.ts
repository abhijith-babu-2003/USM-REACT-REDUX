import express from 'express';
import { registerUser, loginUser, updateUser } from '../Controllers/user/UserController';
import { userOnly } from '../Middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/updateProfile',userOnly,updateUser);

export default router;