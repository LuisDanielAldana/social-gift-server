const express = require("express");
const userController = require('../controllers/user.controller')
const authController = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router.get('/', authController.validateJWT,userController.getWishlistItems)
router.post('/', authController.validateJWT,userController.addItem)
router.delete('/:itemId',authController.validateJWT, userController.removeItem)
router.put('/:itemId/modify-priority',authController.validateJWT,userController.modifyPriority)
router.put('/:itemId/book', authController.validateJWT, userController.bookItem)
router.put('/:itemId/unbook', authController.validateJWT, userController.unbookItem)


module.exports = router

