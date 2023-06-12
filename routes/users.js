const express = require('express');
const router = express.Router();

const friendsRouter = require('./friends');
const wishlistsRouter = require('./wishlists');
const chatsRouter = require('./chats')

const userController = require('../controllers/user.controller')
const authController = require('../controllers/auth.controller')

router.get('/', authController.validateJWT,userController.getUsers)
router.post('/', userController.createUser)
router.get('/:userId',authController.validateJWT, userController.findUserById)
router.post('/login', userController.login)
router.put('/:userId',authController.validateJWT, userController.updateUser)
router.delete('/:userId',authController.validateJWT, userController.deleteUser)

router.use("/:userId/friends", friendsRouter);
router.use("/:userId/wishlists", wishlistsRouter);
router.use("/:userId/chats", chatsRouter);

module.exports = router;
