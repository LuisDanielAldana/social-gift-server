const express = require("express");
const userController = require('../controllers/user.controller')
const authController = require("../controllers/auth.controller");

const itemsRouter = require('./items')

const router = express.Router({ mergeParams: true });

router.post('/',authController.validateJWT, userController.createWishlist)
router.get('/', authController.validateJWT,userController.getAllWishlists)
router.get('/:wishlistId',authController.validateJWT, userController.getWishlistById)
router.put('/:wishlistId',authController.validateJWT, userController.editWishlist)
router.delete('/:wishlistId',authController.validateJWT, userController.deleteWishlist)


router.use('/:wishlistId/items', itemsRouter)

module.exports = router

