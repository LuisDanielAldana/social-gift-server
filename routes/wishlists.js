const express = require("express");
const userController = require('../controllers/user.controller')

const router = express.Router({ mergeParams: true });

router.post('/', userController.createWishlist)
router.get('/:wishlistId', userController.getWishlistById)
router.put('/:wishlistId', userController.editWishlist)
router.get('/:wishlistId/items', userController.getWishlistItems)
router.post('/:wishlistId/items', userController.addItem)
router.put('/:wishlistId/items/:itemId/delete', userController.removeItem)
router.put('/:wishlistId/items/:itemId/modify-priority', userController.modifyPriority)

module.exports = router

