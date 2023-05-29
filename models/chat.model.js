const mongoose = require('mongoose');
const moment = require("moment/moment");

const chatSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        receiver:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        message: {
          type: String,
          required: true,
          default: ""
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now
        },
    }
)

const Chat = mongoose.model('Chat',chatSchema);

module.exports = {
    Chat
}
