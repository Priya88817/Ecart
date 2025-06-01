
const express=require('express')
const router=express.Router();
const upload=require('../config/multer-config')
const productModel=require("../models/product-model")
router.post("/create",upload.single("image"),async function(req,res)
{
    try{let {name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,} =req.body;
   let product= await productModel.create(
    {
        image:req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
    })
    req.flash("success","Product created successfully.")
    res.redirect("/owners/admin");}
    catch(err)
    {
        res.send(err.message);
    }
});
router.post("/edit/:prod",upload.single("image"),async(req,res)=>{
    let {name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,} =req.body;

    const product = await productModel.findOne({_id:req.params.prod});
    
    product.name = name;
    product.price = price;
    product.discount = discount;
    product.bgcolor = bgcolor;
    product.panelcolor = panelcolor;
    product.textcolor = textcolor;

    // Update image only if a new one was uploaded
    if (req.file && req.file.buffer) {
      product.image = req.file.buffer;
    }

    await product.save(); // Save changes

    res.redirect("/owners/Allproducts");
})

module.exports=router;