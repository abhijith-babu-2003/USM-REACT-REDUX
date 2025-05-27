import express from 'express'
import { adminOnly } from '../Middleware/authMiddleware'
import { getUsers,loginAdmin,createUser, updateUsers,deleteUser } from "../Controllers/admin/adminController";

const router =express.Router()

router.post('/login',loginAdmin)
router.get('/getUsers',adminOnly,getUsers)
router.post('/createUser',createUser)
router.put('/updateUser/:id',adminOnly,updateUsers)
router.delete('/deleteUser/:id',adminOnly,deleteUser)

export default router
