const User = require('../models/user.model').User;
const authController = require('../controllers/auth.controller')
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId

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
                obj: newUser
            })
        } catch (err){
            console.error(err);
            res.status(400).json({
                message: "Unable to create user"
            })
        }
    } else {
        res.status(400).json({
            message: "Some parameters were missing",
            obj: null
        })
    }
}

async function findUserById(req, res) {
    const _id = req.params.userId
    try {
        const user = await User.findOne(
            {_id: _id},
            {password:0}
        )
        res.status(200).json({
            obj: user
        })
    } catch(e){
        res.status(400).json({
            message: "Cant find user"
        })
    }

}

async function getUsers(req, res){
    const search = req.query.search
    const reg = new RegExp(`.*${search}.*`, 'i');
    try{
        if(search){
            const users = await User.find({}, {password:0}).or([{ 'name': { $regex: reg }}, { 'lastName': { $regex: reg }}, { 'email': { $regex: reg }}])
            res.status(200).json({
                message: "All coincidences",
                obj: users
            })
        } else {
            const users = await User.find({}, {password: 0})
            res.status(200).json({
                message: "All users",
                obj: users
            })
        }
    } catch (e){
        res.status(400).json({
            message: "Error getting users",
            error: e
        })
    }
}

async function login(req, res){
    const email = req.body.email
    const password = req.body.password
    try{
        const user = await User.findOne({
                email:email,
                password:password
            },
            {password: 0}
        )
        if(user){
            const token = authController.generateJWT({
                _id: user._id,
                email: email,

            })
            res.status(200).json({
                message: "Welcome",
                authToken: token

            })
        } else {
            res.status(400).json({
                message: "Wrong email or password"
            })
        }

    } catch(e) {
        res.status(400).json({
            message: "Can't Login",
            error: e
        })
    }
}

async function updateUser(req, res){
    const _id = req.params.userId
    const name = req.body.name
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password
    const image = req.body.image
    try {
        const updatedUser = await User.updateOne(
            {_id:_id},
            {
                name: name,
                lastname: lastname,
                email: email,
                password: password,
                image: image
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

async function deleteUser(req, res){
    const _id = req.params.userId
    try{
        const deletedUser = await User.deleteOne({
            _id: _id
        })
        res.status(200).json({deletedUser})
    } catch (e){
        res.status(400).json({error:e})
    }
}

async function getFriends(req, res){
    const _id = req.params.userId
    try{
        const friends = await User.findOne(
            {_id:_id},
            {friends:1}).populate({path:"friends", model:"User"})
        res.status(200).json({
            obj: friends
        })
    } catch(e){
        res.status(400).json({
            message: "Error",
            error: e
        })
    }
}

async function getFriendRequest(req, res){
    const _id = req.params.userId
    try{
        const friendRequests = User.findOne(
            {_id:_id},
            {friend_requests:1,}).populate({path:"friend_requests", model:"User"})
        res.status(200).json({
            message: "All pending requests of user",
            requests: friendRequests
        })
    } catch(e) {
        res.status(400).json({
            message: "Can't get friend requests"
        })
    }
}

async function sendFriendRequest(req, res){
    const senderId = req.params.userId
    const receiverId = req.params.receiver
    try{
        const receiver = await User.findOne(
            {_id:receiverId}
        )
        if(receiver.friend_requests.includes(senderId)){
            res.status(400).json({
                message: "A request already exists"
            })
        }
        else{
            const reqReceiver = await User.updateOne(
                {_id: receiverId},
                {$push:
                        {friend_requests: senderId}}
            )
            res.status(201).json({
                obj: reqReceiver
            })
        }

    } catch(e){
        res.status(400).json({
            error: e
        })
    }
}

async function acceptFriendRequest(req, res){
    const receiver_id = req.params.userId
    const sender_id = req.params.senderId
    try{

        const sender = await User.findOne(
            {_id:sender_id}
        )

        const receiver = await User.findOne(
            {_id:receiver_id}
        )

        if(sender.friends.includes(receiver_id)){
            res.status(400).json({
                message: "Users are already friends"
            })
        }

        else {
            const removedRequest = await User.updateOne(
                {_id: receiver_id},
                {$pullAll: {
                        friend_requests: [{_id: sender_id}],
                    }}
            )
            const addedFriendsReceiver = await User.updateOne(
                {_id: receiver_id},
                {$push:
                        {friends: sender_id}}
            )
            const addedFriendsSender = await User.updateOne(
                {_id: sender_id},
                {$push:
                        {friends: receiver_id}}
            )
            res.status(200).json({
                message: "Request accepted successfully",
                obj: [sender, receiver]
            })
        }


    } catch(e){
        res.status(400).json({
            error: e
        })
    }
}

async function declineFriendRequest(req, res){
    const receiverId = req.params.userId
    const senderId = req.params.senderId
    try{
        const receiver = await User.findOne(
            {_id:receiverId}
        )
        if(receiver.friend_requests.includes(senderId)){
            const declinedRequest = await User.updateOne(
                {_id:receiverId},
                {$pullAll: {
                        friend_requests: [{_id: senderId}],
                    }}
            )
            res.status(200).json({
                message: "Friend request declined",
                obj: declinedRequest
            })
        } else{
            res.status(400).json({
                message: "No friend request found"
            })
        }

    } catch (e){
        res.status(400).json({
            message: "Error"
        })
    }
}

async function removeFriends(req, res){
    const userId = req.params.userId
    const friendId = req.params.friendId
    try{
        const user = await User.findOne(
            {_id:userId}
        )
        const friend = await User.findOne(
            {_id:friendId}
        )
        if(user.friends.includes(friendId)){
            const removeFromUser = await User.updateOne(
                {_id:userId},
                {$pullAll: {
                        friends: [{_id: friendId}],
                    }}
            )
            const removeFromSecondUser = await User.updateOne(
                {_id: friendId},
                {$pullAll: {
                        friends: [{_id: userId}],
                    }}
            )
            res.status(200).json({
                message: "Users no longer friends",
                obj: [removeFromUser, removeFromSecondUser]
            })
        } else{
            res.status(400).json({
                message: "Users are not friends"
            })
        }
    } catch(e){
        res.status(400).json({
            error: e
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
                      end_date: moment(end_date).format('YYYY-MM-DD')
                    }
                    }}
        )
        res.status(201).json({
            message: "New Wishlist created",
            obj: newWishlist
        })
    } catch(e){
        res.status(400).json({
            message: "Can't create Wishlist",
            error: e
        })
    }
}

async function getAllWishlists(req, res){
    const userId = req.params.userId;
    try{
        const wishlists = await User.findOne({
            _id: userId
        }, {
            wishlists:1
        })
        res.status(200).json({obj: wishlists})
    } catch (e){
        res.status(400).json({error: e})
    }
}

async function getWishlistById(req, res){
    const userId = req.params.userId
    const wishlistId = req.params.wishlistId
    try{
        const wishlist = await User.findOne(
            {_id: userId, "wishlists._id":wishlistId},
            {"wishlists.$": 1}
        )
        res.status(200).json({
            obj: wishlist
        })
    } catch (e){
        res.status(400).json({
            error: e
        })
    }
}

async function editWishlist(req, res){
    const userId = req.params.userId
    const wishlistId = req.params.wishlistId
    const title = req.body.title
    const description = req.body.description
    const image = req.body.image
    try{
        const editedWishlist = await User.updateOne(
            {_id: userId, "wishlists._id":wishlistId},
            { $set: {
                    "wishlists.$.title": title,
                    "wishlists.$.description": description,
                    "wishlists.$.image": image
                }
            }
        )
        res.status(200).json({
            obj: editedWishlist
        })
    } catch (e){
        res.status(400).json({
            error: e
        })
    }
}

async function getWishlistItems(req, res){
    const userId = req.params.userId;
    const wishlistId = req.params.wishlistId;
    try{
        const items = await User.aggregate([
            { $match: { _id: new ObjectId(userId) } },
            { $unwind: "$wishlists" },
            { $match: { "wishlists._id": new ObjectId(wishlistId) } },
            { $project: { items: "$wishlists.items" } }
        ]);
        res.status(200).json({data: items})
    } catch (e){
        res.status(400).json({error: e})
    }
}

async function addItem(req, res){
    const userId = req.params.userId
    const wishlistId = req.params.wishlistId
    const name = req.body.name;
    const description = req.body.description;
    const image = req.body.image;
    const url = req.body.url
    try{
        const user = await User.findOne({_id: userId})
        const wish_list = user.wishlists.id(wishlistId);
        const userWishlist = await User.findOne(
            {_id: userId, "wishlists._id":wishlistId},
            {"wishlists.$": 1}
        )
        const newItem = await User.updateOne(
            {_id: userId, "wishlists._id":wishlistId},
            { $push: {
                "wishlists.$.items":{
                    name: name,
                    description: description,
                    priority: wish_list.items.length+1,
                    image: image,
                    url: url
                }
                }
            }
        )
        res.status(201).json({
            obj: newItem
        })
    } catch (e){
        res.status(400).json({
            error: e
        })
    }
}

async function removeItem(req, res){
    const userId = req.params.userId
    const wishlistId = req.params.wishlistId
    const itemId = req.params.itemId
    try{
        const modifiedWishlist = await User.updateOne(
            {
                _id: userId,
                "wishlists._id": wishlistId
            },
            {
                $pull: {
                    "wishlists.$.items": {
                        _id: itemId
                    }
                }
            }
        )
        res.status(200).json({
            obj: modifiedWishlist
        })
    } catch (e){
        res.status(400).json({
            message: 'Error removing item from wishlist',
            error: e
        })
    }
}

async function deleteWishlist(req, res){
    const userId = req.params.userId
    const wishlistId = req.params.wishlistId;
    try{
        const deletedWishlist = await User.findByIdAndUpdate(userId,
            {$pull: { wishlists: {_id: wishlistId}}})
        res.status(200).json({obj: deletedWishlist})
    } catch (e){
        res.status(400).json({error: e})
    }
}

async function modifyPriority(req, res){
    const userId = req.params.userId;
    const wishlistId = req.params.wishlistId;
    const itemId = req.params.itemId;
    const priority = req.body.priority
    try{
        const user = await User.findOne({_id: userId})
        const wishlist = user.wishlists.id(wishlistId);
        const item = wishlist.items.id(itemId);
        const oldPriority = item.priority;
        item.priority = priority;
        if (oldPriority === priority) {
            await user.save();
            return res.json({ success: true});
        }
        wishlist.items.forEach((otherItem) => {
            if (otherItem._id.toString() !== itemId && otherItem.priority >= priority) {
                otherItem.priority += 1;
            } else if (otherItem._id.toString() !== itemId && otherItem.priority > oldPriority && otherItem.priority < priority) {
                otherItem.priority -= 1;
            }
        });
        await user.save();
        res.status(200).json({
            obj: user
        })

    } catch (e){
        res.status(404).json({error: e})
    }
}

async function bookItem(req, res){
    const userId = req.params.userId
    const wishlistId = req.params.wishlistId
    const itemId = req.params.itemId
    const reservedBy = req.body.reservedBy
    try{
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const wishlist = user.wishlists.find((wishlist) => wishlist._id.toString() === wishlistId);
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found'});
        }
        const item = wishlist.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.reserved = true;
        item.reserved_by = reservedBy;

        await wishlist.save();
        res.status(200).json({obj: item})
    } catch (e){
        res.status(400).json({error: e})
    }
}

async function unbookItem(req, res){
    const userId = req.params.userId
    const wishlistId = req.params.wishlistId
    const itemId = req.params.itemId
    try{
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const wishlist = user.wishlists.find((wishlist) => wishlist._id.toString() === wishlistId);
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found'});
        }
        const item = wishlist.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.reserved = false;
        item.reserved_by = null;

        await wishlist.save();
        res.status(200).json({obj: item})
    } catch (e){
        res.status(400).json({error: e})
    }
}

module.exports = {
    getUsers,
    createUser,
    findUserById,
    login,
    updateUser,
    deleteUser,
    getFriends,
    sendFriendRequest,
    getFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriends,
    createWishlist,
    getAllWishlists,
    getWishlistById,
    editWishlist,
    getWishlistItems,
    addItem,
    removeItem,
    deleteWishlist,
    modifyPriority,
    bookItem,
    unbookItem
}

