const express=require('express')
const router=express.Router();
const ownerModel=require("../models/owner-model")
const productModel = require("../models/product-model");
const jwt=require("jsonwebtoken");
const {generateToken}=require("../utils/generateToken");
const isOwnerLoggedin = require('../middlewares/isOwnerLoggedin');

if(process.env.NODE_ENV ==="development")
{
    router.post("/create", async function(req,res)
    {
        let owners =await ownermodel.find();
        if(owners.length >0) 
        {
            return res
            .status(500)
            .send("You don't have permission to create a new owner.")

        }
        let{fullname,email,password}=req.body;
        let createdOwner=await ownerModel.create({
            fullname,
            email,
            password,
        })
        res.status(202).send(createdOwner)
    });

}
router.get("/login",async(req,res)=>{
    res.render("owner-login");
})
router.post("/login",async (req,res)=>{
    let {email,password} = req.body;
    const owner = await ownerModel.findOne({email});
    if(!owner)
    {
        req.flash("error" ,"email or password incorrect");
        return res.redirect("/")
    }
    if(password === owner.password)
    {
        let token=generateToken(owner);
        res.cookie("token",token,{httpOnly: true});
        res.redirect('/owners/admin');
    }
    else
    {
         req.flash("error" ,"email or password incorrect");
        return res.redirect("/")
    }
    
})
router.get("/admin",function(req,res)
{   let success=req.flash("success");
    res.render("createproducts",{success});
});
router.get("/Allproducts",isOwnerLoggedin,async(req,res)=>{
    const products = await productModel.find();
    let success=req.flash("success");
    res.render("adminAllproduct",{products,success});
})
router.post("/removeProduct/:prod",async(req,res)=>{
    await productModel.findOneAndDelete({_id:req.params.prod});
    res.redirect("/owners/Allproducts");
})
router.get("/editProduct/:prod",isOwnerLoggedin,async(req,res)=>{
     let success=req.flash("success");
    const product = await productModel.findOne({_id:req.params.prod});
    res.render("editProduct",{product,success});
})
module.exports=router;
