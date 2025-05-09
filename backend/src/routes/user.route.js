import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getRecommendedUser, sendFriendRequest } from '../controllers/user.controller.js'
const router = express.Router()

// apply protectedRoute middleware to all routes
router.use(protectedRoute)


router.get('/',getRecommendedUser)

router.get('/friends',getMyFriends)

router.post('/friend-request/:id',sendFriendRequest)

router.put('/friends/:id/accept',acceptFriendRequest)

router.get('/friend-requests',getFriendRequests)

router.get('/outgoing-friendRequests',getOutgoingFriendRequests)





export default router
