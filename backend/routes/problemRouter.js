const express=require('express');
const problem=require('../models/problem')
const router=express.Router();

router.get('/', async (req,res) => {
    const id=req.user._id;
    if(!id) return res.status(404).json({error: "Error occured"});
    const allProblems=await problem.find({ createdBy: id });
    return res.json(allProblems);
})

router.post('/create', async (req,res) => {
    const body=req.body;
    console.log("The user is:" ,req.user);
    if(!body) return res.status(404).json({error: "Error occured"});
    const exists= await problem.findOne({ 
        name: body.name,
        difficulty: body.difficulty,
        createdBy: req.user._id,
        category: body.category
    });
    if(exists) return res.status(200).json({msg: "Problem Already Exists", problem: exists, exists: 1})
    const newProblem = await problem.create({
        name: body.name,
        difficulty: body.difficulty,
        createdBy: req.user._id,
        category: body.category,
        status: false,
        bookmark: false,
        link: body.link
    });
    return res.status(200).json({msg: "Problem Created SUccessfully", problem:newProblem, exists: 0});
});

router.patch('/update/:id', async(req,res) => {
    const id=req.params.id;
    const body=req.body;
    if(!body) return res.status(404).json({error: "Error occured"});
    const problemFound=await problem.findById(id);
    if(!problemFound) return res.status(404).json({error: "Error occured"});// Invalid URL and no problem exists
    const updatedProblem= await problemFound.updateOne({
        name: (body.name) ? body.name : problemFound.name,
        difficulty: (body.difficulty) ? body.difficulty : problemFound.difficulty,
        category: (body.category) ? body.category : problemFound.category,
        status: !problemFound.status,
    });
    return res.status(200).json({msg: "Problem Patched SUccessfully"});
})

router.delete('/delete/:id', async (req,res) => {
    const id=req.params.id;
    if(!id) return res.status(404).json({error: "Error occured"});
    const problemFound=await problem.findById(id);
    if(!problemFound) return res.status(404).json({error: "Error occured"});
    const deleteOp=await problem.findByIdAndDelete(id);
    return res.status(200).json({msg: "Problem Deleted SUccessfully"});
})

router.post('/note/:id', async (req,res) =>{
    const id=req.params.id;
    const body = req.body;
    if(!body) return res.status(404).json({msg: "Not able to Fetch Body"})
    const requiredProblem=await problem.findById(id);
    if(!requiredProblem) return res.status(404).json({msg: "Problem Does Not Exist!"});
    const updatedProblem=await requiredProblem.updateOne({
        notes: body.notes
    });
    return res.status(200).json({msg: "Notes Added Successfully!"});
})

router.patch('/bookmark/:id', async (req,res) => {
    const id=req.params.id;
    const body=req.body;
    if(!body) return res.status(404).json({error: "Error occured"});
    const problemFound=await problem.findById(id);
    if(!problemFound) return res.status(404).json({error: "Error occured"});// Invalid URL and no problem exists
    const updatedProblem= await problemFound.updateOne({
        bookmark: !problemFound.bookmark
    });
    return res.status(200).json({msg: "Problem Patched SUccessfully"});
})

module.exports=router;