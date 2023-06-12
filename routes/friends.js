const express = require("express");
const userController = require('../controllers/user.controller')
const authController = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router.get('/',authController.validateJWT, userController.getFriends)
router.get('/requests', authController.validateJWT,userController.getFriendRequest)
router.post('/:receiver',authController.validateJWT, userController.sendFriendRequest)
router.put('/:senderId/accept',authController.validateJWT, userController.acceptFriendRequest)
router.put('/:senderId/decline',authController.validateJWT, userController.declineFriendRequest)
router.delete('/:friendId/remove',authController.validateJWT, userController.removeFriends)

module.exports = router

