import express from 'express';

import { signup, login } from '../controler/userControler.js';
import {verifyOtp, resendOtp} from '../controler/optVerify.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/verifyotp',verifyOtp);
router.post('/resendotp',resendOtp)


export default router;