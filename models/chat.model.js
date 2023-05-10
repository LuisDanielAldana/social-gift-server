import mongoose from "mongoose";
import moment from "moment/moment";

const ChatSchema = new mongoose.Schema(
    {
        userOne: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: ""
        },
        userTwo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: ""
        },
        messages: {
            type: [MessageSchema],
            default: []
        }
    }
)

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true,
            default:""
        },
        text: {
            type: String,
            required: true,
            default:""
        },
        timestamp: {
            type: Date,
            required: true,
            default: moment().format('YYYY-MM-DD')
        }
    }
)

const Chat = mongoose.model('Chat',ChatSchema);

module.exports = {
    Chat
}
