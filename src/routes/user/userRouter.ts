import express from 'express';
import { createUser } from '../../controllers/user/userController';

const userRouter = express.Router();

userRouter.post('/register', createUser);

export default userRouter;