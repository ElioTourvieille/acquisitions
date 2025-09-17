import express from 'express';
import { signUp, signIn, signOut } from '#controllers/auth.controller.js';

const router = express.Router();

// Sign up
router.post('/sign-up', signUp);

// Sign in
router.post('/sign-in', signIn);

// Sign out
router.post('/sign-out', signOut);

export default router;