import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { acceptFriendRequest, getMyFriends, getRecommendedUser, sendFriendRequest } from '../controllers/user.controller.js'
const router = express()

// apply protectedRoute middleware to all routes
router.use(protectedRoute)

router.get('/',getRecommendedUser)

router.get('/friends',getMyFriends)

router.post('/friend-request/:id',sendFriendRequest)

router.put('/friends/:id/accept',acceptFriendRequest)





export default router
