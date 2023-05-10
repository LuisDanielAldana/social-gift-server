const mongoose = require('mongoose');
const moment = require("moment/moment");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ItemSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            default: ""
        },
        name:{
            type: String,
            required: true,
            default: ""
        },
        description: {
            type: String,
            required: true,
            default: ""
        },
        priority: {
            type: Number
        },
        image: {
            type: String,
            required: true,
            default: ""
        },
        reserved: {
            type: Boolean,
            required: true,
            default: false
        },
        reserved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: ""
        },
        item_url: {
            type: String,
            required: true,
            default: ""
        },
        date_added: {
            type: Date,
            required: true,
            default: moment().format('YYYY-MM-DD')
        }
    }
)

ItemSchema.plugin(AutoIncrement, {id:'priority_seq',inc_field: 'priority'});


const WishlistSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: "Wishlist"
        },
        description: {
            type: String,
            required: true,
            default: "My Wishlist"
        },
        image: {
            type: String,
            required: true,
            default: ""
        },
        created: {
            type: Date,
            default: moment().format('YYYY-MM-DD')
        },
        end_date: {
            type: Date,
            required: true,
            default: moment().add(1, 'year').calendar()
        },
        items: {
            type: [ItemSchema],
            required:true,
            default: []
        }
    }
)

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default:""
        },
        lastname: {
            type: String,
            required: true,
            default:""
        },
        email: {
            type: String,
            required: true,
            default:""
        },
        password: {
            type: String,
            required: true,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        friends: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        friend_requests: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        wishlists: {
            type: [WishlistSchema],
            default: []
        }
    }
)

const User = mongoose.model('User',UserSchema);

module.exports = {
    User
}
