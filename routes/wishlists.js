const express = require("express");
const userController = require('../controllers/user.controller')
const authController = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router.post('/',authController.validateJWT, userController.createWishlist)
router.get('/', authController.validateJWT,userController.getAllWishlists)
router.get('/:wishlistId',authController.validateJWT, userController.getWishlistById)
router.put('/:wishlistId',authController.validateJWT, userController.editWishlist)
router.get('/:wishlistId/items', authController.validateJWT,userController.getWishlistItems)
router.delete('/:wishlistId',authController.validateJWT, userController.deleteWishlist)
router.post('/:wishlistId/items', authController.validateJWT,userController.addItem)
router.delete('/:wishlistId/items/:itemId',authController.validateJWT, userController.removeItem)
router.put('/:wishlistId/items/:itemId/modify-priority',authController.validateJWT,userController.modifyPriority)

module.exports = router

