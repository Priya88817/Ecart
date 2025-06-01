const express=require('express')
const router=express.Router();
const isloggedin=require("../middlewares/isLoggedIn");
const isOwnerLoggedin = require("../middlewares/isOwnerLoggedin")
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
router.get("/",function(req,res)
{
    let error=req.flash("error");
    res.render("index",{error,loggedin:false});
});
router.get("/shop",isloggedin,async function(req,res)
{
    let Newest = await productModel.find().sort({ date: -1 }).limit(4);
    let Discounted = await productModel.find().sort({ discount: -1 }).limit(4);
    let products = await productModel.find();
    let success = req.flash("success")
    res.render("shop",{Newest,Discounted,products,success});
})
router.get("/cart",isloggedin,async function(req,res)
{
    let user= await userModel.findOne({email:req.user.email}).populate("cart.product")
    console.log(user);
    res.render("cart",{user});
})
router.get("/addtocart/:productid", isloggedin, async function(req, res) {
    const productId = req.params.productid;
    const user = await userModel.findOne({ email: req.user.email });

    // Check if product is already in the cart
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (cartItem) {
        // Increment quantity
        cartItem.count += 1;
    } else {
        // Add new item to cart
        user.cart.push({ product: productId, count: 1 });
    }

    await user.save();
    req.flash("success", "Added to Cart");
    res.redirect("/shop");
});
router.post("/addtocart/:productid", isloggedin, async function(req, res) {
    const productId = req.params.productid;
    const user = await userModel.findOne({ email: req.user.email });

    // Check if product is already in the cart
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (cartItem) {
        // Increment quantity
        cartItem.count += 1;
    } else {
        // Add new item to cart
        user.cart.push({ product: productId, count: 1 });
    }

    await user.save();
    req.flash("success", "Added to Cart");
    res.redirect("/cart");
});
router.post("/subtractfromCart/:productid", isloggedin, async function(req, res) {
    const productId = req.params.productid;
    const user = await userModel.findOne({ email: req.user.email });

    // Find the cart item
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
        const cartItem = user.cart[cartItemIndex];

        if (cartItem.count > 1) {
            // Decrease quantity
            cartItem.count -= 1;
        } else {
            // Remove item completely
            user.cart.splice(cartItemIndex, 1);
        }

        await user.save();
        req.flash("success", "Item removed from cart");
    } else {
        req.flash("error", "Item not found in cart");
    }

    res.redirect("/cart");
});

router.get("/logout",isloggedin,function(req,res){
    res.render("shop")
})

module.exports=router;
