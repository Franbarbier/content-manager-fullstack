import express from 'express'
import { getUserFromToken } from '../auth.js'

import { login } from '../controllers/users.js'

const router = express.Router()
router.post('/login', login)
router.get('/verify', getUserFromToken)

export default router