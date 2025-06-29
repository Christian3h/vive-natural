import express from 'express'

const router = express.Router();

import googleAuth from './googleAuthRoutes.js'
router.use('/google', googleAuth)

import authRoutes from './authRoutes.js'
router.use('/auth', authRoutes)

export default router;