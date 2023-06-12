const express = require('express');
const router = express.Router();

const friendsRouter = require('./friends');
const wishlistsRouter = require('./wishlists');
const chatsRouter = require('./chats')

const userController = require('../controllers/user.controller')
const authController = require('../controllers/auth.controller')

router.get('/', userController.getUsers)
router.post('/', userController.createUser)
router.get('/:userId', userController.findUserById)
router.post('/login', userController.login)
router.put('/:userId', userController.updateUser)
router.delete('/:userId', userController.deleteUser)

router.use("/:userId/friends", friendsRouter);
router.use("/:userId/wishlists", wishlistsRouter);
router.use("/:userId/chats", chatsRouter);

module.exports = router;
