
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { FriendController } from './friends.controller';
const router = express.Router();

router.get('/', auth(USER_ROLE.USER),FriendController.getFriends);

export const FriendRoutes = router;