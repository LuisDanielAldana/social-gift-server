var express = require('express');
var router = express.Router();

const userController = require('../controllers/user.controller')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', userController.createUser)
router.get('/:userId', userController.findUserById)
router.post('/login',userController.login)
router.post('/:userId/create-wishlist', userController.createWishlist)


module.exports = router;
