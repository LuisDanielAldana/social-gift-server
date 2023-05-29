const express = require("express");
const userController = require('../controllers/user.controller')

const router = express.Router({ mergeParams: true });

router.get('/', userController.getFriends)
router.get('/requests', userController.getFriendRequest)
router.put('/:receiver', userController.sendFriendRequest)
router.post('/:senderId/accept', userController.acceptFriendRequest)
router.put('/:senderId/decline', userController.declineFriendRequest)
router.put('/:friendId/remove', userController.removeFriends)

module.exports = router
