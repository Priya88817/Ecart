const mongoose=require('mongoose');
const userSchema = mongoose.Schema({
    fullname:
    {
        type:String,
        minLength:3,
        trim:true,
    },
    email:String,
    password:String,
    cart: [
        {
            product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product", // Make sure your model is named "Product"
            // required: true,
            },
            count: {
            type: Number,
            default: 1,
            min: 1,
            }
        }
    ],
    orders:{
        type:Array,
        default:[], 
    },
    contact:Number,
    picture:Buffer,
});
module.exports=mongoose.model("user",userSchema);