var express = require('express');
var router = express.Router();

const userController = require('../controllers/user.controller')
const {sendFriendRequest} = require("../controllers/user.controller");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', userController.createUser)
router.get('/:userId', userController.findUserById)
router.post('/login',userController.login)
router.post('/:userId/update', userController.updateUser)
router.put('/:userId/updateImage', userController.updateUserImage)
router.post('/search',userController.searchUser)
router.get('/:userId/friends', userController.getFriends)
router.post('/:userId/friend-request/:receiver', sendFriendRequest)
router.post('/:userId/create-wishlist', userController.createWishlist)



module.exports = router;
