const express=require("express");
const user=require("../models/user");
const bcrypt=require('bcrypt');
const router=express.Router();
const { getUser,setUser }=require('../Service/auth')

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
}

router.post('/user/register', async (req,res) => {
    const body=req.body;
    if(!body) return; // Sorry error occured message
    const found=await user.findOne({ email: body.email });
    if(found) return ;// Display message that user exists
    const hashedPassword=await hashPassword(body.password);
    const newUser=await user.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
    })
    return res.end("User Created Successfully");
    //Here redirect to sign in page
});

router.post('/user/signin', async (req,res) => {
    const body=req.body;
    if(!body) return ;// Sorry error occured message
    const found=await user.findOne({ email:body.email});
    if(!found) return ;// Display message that user does not exists
    else{
        const isMatch = await bcrypt.compare(body.password, found.password);
        if(!isMatch){
            return; // Display incorrect password
        }
    }
    const token=setUser(found);
    res.cookie("token",token);
    return res.send("User Logged In");
    // now return statement to home page

})

module.exports=router;