const mongoose=require('mongoose');
const productSchema = mongoose.Schema({
    name:String,
    image:Buffer,
    price:Number,
    discount:{
        type:Number,
        default:0
    },
    bgcolor:String,
    panelcolor:String,
    textcolor:String,
    date: {
    type: Date,
    default: Date.now // Automatically sets current date/time on creation
  }

});
module.exports=mongoose.model("product",productSchema);