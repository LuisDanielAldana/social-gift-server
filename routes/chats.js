const express = require("express");
const chatController = require('../controllers/chat.controller')

const router = express.Router({ mergeParams: true });

router.get('/', chatController.getAllChats)
router.get('/:receiverId', chatController.getSingleChat)
router.post('/:receiverId', chatController.sendMessage)

module.exports = router
