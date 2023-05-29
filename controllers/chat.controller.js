const User = require('../models/user.model').User;
const Chat = require('../models/chat.model').Chat
const authController = require('../controllers/auth.controller')
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId

async function getAllChats(req, res){
    const userId = req.params.userId;
    try{
        const chats = await Chat.aggregate([
            {
                $match: {
                    $or: [{ sender: new ObjectId(userId) }, { receiver: new ObjectId(userId) }]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', new ObjectId(userId)] },
                            '$receiver',
                            '$sender'
                        ]
                    },
                    chats: {
                        $push: {
                            _id: '$_id',
                            sender: '$sender',
                            receiver: '$receiver',
                            message: '$message',
                            timestamp: '$timestamp'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    chats: 1
                }
            }
        ]);
        res.status(200).json({obj: chats})
    } catch (e){
        res.status(500).json({error: e})
    }
}

async function getSingleChat(req, res){
    const senderId = req.params.userId;
    const receiverId = req.params.receiverId;
    try {

        const chats = await Chat.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ timestamp: 1 });
        res.status(200).json({data: chats})
    } catch (e) {
        res.status(500).json({error: e});
    }
}

async function sendMessage(req, res){
    const senderId = req.params.userId;
    const receiverId = req.params.receiverId;
    const message = req.body.message;
    try{
        const newMessage = await new Chat({
            sender: senderId,
            receiver: receiverId,
            message: message
        }).save()
        res.status(201).json({obj: newMessage})
    } catch (e){
        res.status(400).json({error: e})
    }
}

module.exports = {
    getAllChats,
    getSingleChat,
    sendMessage
}
