const express=require('express');
const router=express.Router();
const isloggedin=require("../middlewares/isLoggedIn")
const upload=require('../config/multer-config')
const usermodel = require('../models/user-model')
const {
     registerUser,loginUser,logout
     }=require("../controllers/authController")
router.get("/",function(req,res)
{
    res.send("hey it working");
});
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logout);
router.get("/account",isloggedin,(req,res)=>{
    const user = req.user;
    res.render('account',{user});
});
router.get("/account/edit",isloggedin,(req,res)=>{
    const user = req.user;
    res.render("editAccount",{user});
})
router.post("/account/edit",upload.single("image"),isloggedin,async (req,res)=>{

    let {fullname,email,contact} = req.body;
    if(registerUser.file)
    {
        await usermodel.findOneAndUpdate({email:req.user.email},
        { fullname,
            email,
            contact,
            picture:req.file.buffer},
            { new: true }  
        )
    }
    else
    {
        await usermodel.findOneAndUpdate({email:req.user.email},
        { fullname,
            email,
            contact,},
            { new: true }  
        )
    }
    
    res.redirect("/users/account");
})
module.exports=router;