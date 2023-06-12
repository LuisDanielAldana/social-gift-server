const express = require("express");
const userController = require('../controllers/user.controller')

const router = express.Router({ mergeParams: true });

router.get('/', userController.getFriends)
router.get('/requests', userController.getFriendRequest)
router.post('/:receiver', userController.sendFriendRequest)
router.put('/:senderId/accept', userController.acceptFriendRequest)
router.put('/:senderId/decline', userController.declineFriendRequest)
router.delete('/:friendId/remove', userController.removeFriends)

module.exports = router
