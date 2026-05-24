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
    if(!body) return res.status(404).json({error: "Error occured"}); // Sorry error occured message
    const found=await user.findOne({ email: body.email });
    if(found) return res.status(404).json({error: "Error occured"});// Display message that user exists
    const hashedPassword=await hashPassword(body.password);
    const newUser=await user.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
    })
    return res.status(200).json({msg: "User Created Successfully"});
    //Here redirect to sign in page
});

router.post('/user/signin', async (req,res) => {
    const body=req.body;
    if(!body) return res.status(404).json({error: "Error occured"});// Sorry error occured message
    const found=await user.findOne({ email:body.email});
    if(!found) return res.status(404).json({error: "Error occured"});// Display message that user does not exists
    else{
        const isMatch = await bcrypt.compare(body.password, found.password);
        if(!isMatch){
            return res.status(404).json({error: "Error occured"}); // Display incorrect password
        }
    }
    const token=setUser(found);
    res.cookie("token",token);
    return res.status(200).json({msg: "User Logged In"});
    // now return statement to home page

})

router.get('/user/verify', async(req,res) => {
    const tokenCookie=req.cookies.token;
    const authHeader = req.headers['authorization'];
    let token = null;
    if (tokenCookie) {
        token = tokenCookie;
    } else if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split("Bearer ")[1];
    }
    if(token) return res.status(200).json({msg: "Let User Go In"});
    return res.status(404).json({msg: "User Not Logged In!"});
})

router.post('/user/logout', (req,res) => {
    res.clearCookie();
    return res.status(200).json({msg: "Logged out Successfully!!"});
})

module.exports=router;