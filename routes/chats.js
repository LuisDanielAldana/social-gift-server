const express = require("express");
const chatController = require('../controllers/chat.controller')
const authController = require('../controllers/auth.controller')

const router = express.Router({ mergeParams: true });

router.get('/', authController.validateJWT, chatController.getAllChats)
router.get('/:receiverId',authController.validateJWT, chatController.getSingleChat)
router.post('/:receiverId', authController.validateJWT, chatController.sendMessage)

module.exports = router
