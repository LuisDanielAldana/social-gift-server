const User = require('../models/user.model').User;
const authController = require('../controllers/auth.controller')

async function createUser(req, res){
    const name = req.body.name;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    if (name && lastname && email && password){
        try {
            const newUser = await new User({
                name: name,
                lastname: lastname,
                email: email,
                password: password,
            }).save();
            res.status(201).json({
                message: "User Created",
                obj: newUser
            })
        } catch (err){
            console.error(err);
            res.status(400).json({
                message: "Unable to create user",
                obj: null
            })
        }
    } else {
        res.status(406).json({
            message: "Some parameters were missing",
            obj: null
        })
    }
}

async function findUserById(req, res) {
    const _id = req.params.userId
    try {
        const user = await User.findOne(
            {_id: _id}
        )
        res.status(200).json({
            message: "User found",
            obj: user
        })
    } catch(e){
        res.status(400).json({
            message: "Cant find user"
        })
    }

}

async function login(req, res){
    const email = req.body.email
    const password = req.body.password
    try{
        const user = User.findOne({
                email:email,
                password:password
            })
        if(user){
            const token = authController.generateJWT({email})
            res.status(200).json({
                message: "Welcome",
                authToken: token

            })
        }

    } catch(e) {
        res.status(400).json({
            message: "Can't Login"
        })
    }
}

async function updateUser(req, res){
    const _id = req.params.userId
    const name = req.body.name
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password
    try {
        const updatedUser = await User.updateOne(
            {_id:_id},
            {
                name: name,
                lastname: lastname,
                email: email,
                password: password
            }
        )
        res.status(200).json({
            message: "Successfully updated User",
            obj: updatedUser
        })
    } catch(e) {
        res.status(400).json({
            message: "Error updating user"
        })
    }
}

async function updateUserImage(req, res){
    const _id = req.params.userId
    const image = req.body.image
    try {
        const updatedUser = await User.updateOne(
            {_id: _id},
            {image: image}
        )
        res.status(200).json({
            message: "Image updated successfully",
            obj: updatedUser
        })
    } catch(e){
        res.status(400).json({
            message: "Unable to update image"
        })
    }
}

async function searchUser(req, res){
    const search = req.body.search
    var reg = new RegExp(`.*${search}.*`, 'i');
    console.log(req.body)
    try{
        const users = await User.find().or([{ 'name': { $regex: reg }}, { 'lastName': { $regex: reg }}, { 'email': { $regex: reg }}])
        res.status(200).json({
            message: "All coincidences",
            obj: users
        })
    } catch(e){
        res.status(400).json({
            message: "Error",
            error: e
        })
    }
}

async function getFriends(req, res){
    const _id = req.params.userId
    try{
        const friends = await User.findOne(
            {_id:_id},
            {friends:1}).populate({path:"friends", model:"User"})
        res.status(200).json({
            message: "All friends",
            obj: friends
        })
    } catch(e){
        res.status(400).json({
            message: "Error"
        })
    }
}

async function sendFriendRequest(req, res){
    const sender = req.params.userId
    const receiver = req.params.receiver
    try{
        const reqReceiver = await User.updateOne(
            {_id: receiver},
            {$push:
                    {friend_requests: sender}}
        )
        res.status(200).json({
            message: "Request sent successfully",
            obj: reqReceiver
        })
    } catch(e){
        res.status(400).json({
            message: "Error"
        })
    }
}

async function createWishlist(req, res) {
    const _id = req.params.userId
    const title = req.body.title
    const description = req.body.description
    const image = req.body.image
    const end_date = req.body.end_date

    try{
        const newWishlist = await User.updateOne(
            {_id: _id},
            {$push:
                    {wishlists: {
                      title:title,
                      description:description,
                      image:image,
                      end_date:end_date
                    }
                    }}
        )
        res.status(200).json({
            message: "New Wishlist created",
            obj: newWishlist
        })
    } catch(e){
        res.status(400).json({
            message: "Can't create Wishlist",
            obj: null
        })
    }
}

module.exports = {
    createUser,
    createWishlist,
    findUserById,
    login,
    updateUser,
    updateUserImage,
    searchUser,
    getFriends,
    sendFriendRequest
}

