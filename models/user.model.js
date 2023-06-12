const mongoose = require('mongoose');
const moment = require("moment/moment");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ItemSchema = new mongoose.Schema(
    {
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
            default: "https://res.cloudinary.com/dficrwc6r/image/upload/v1686556387/kraftbox_q5bjep.jpg"
        },
        reserved: {
            type: Boolean,
            required: true,
            default: false
        },
        reserved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        url: {
          type: String,
          default: "mercado-express-server"
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
            default: "https://res.cloudinary.com/dficrwc6r/image/upload/v1686556063/festive-gift-boxes_g1s86n.jpg"
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
            default: "https://res.cloudinary.com/dficrwc6r/image/upload/v1686555857/profile-icon-design-free-vector_pxltql.jpg"
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
