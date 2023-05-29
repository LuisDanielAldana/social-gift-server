import mongoose from "mongoose";
import moment from "moment/moment";

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true,
            default: null
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

const chatSchema = new mongoose.Schema(
    {
        userOne: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        userTwo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        timestamp: {
            type: Date,
            required: true,
            default: moment().format('YYYY-MM-DD')
        },
        messages: {
            type: [MessageSchema],
            default: []
        }
    }
)



const Chat = mongoose.model('Chat',chatSchema);

module.exports = {
    Chat
}
