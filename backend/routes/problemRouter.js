const express=require('express');
const problem=require('../models/problem')
const router=express.Router();

router.get('/', async (req,res) => {
    const id=req.user._id;
    const allProblems=await problem.find({ createdBy: id });
    return res.send(allProblems);
})

router.post('/create', async (req,res) => {
    const body=req.body;
    if(!body) return ;
    const newProblem = await problem.create({
        name: body.name,
        difficulty: body.difficulty,
        createdBy: req.user._id,
        category: body.category,
    });
    return res.send("Problem Created SUccessfully");
});

router.patch('/update/:id', async(req,res) => {
    const id=req.params.id;
    const body=req.body;
    if(!body) return ;
    const problemFound=await problem.findById(id);
    if(!problemFound) return ;// Invalid URL and no problem exists
    const updatedProblem= await problemFound.updateOne({
        name: (body.name) ? body.name : problemFound.name,
        difficulty: (body.difficulty) ? body.difficulty : problemFound.difficulty,
        category: (body.category) ? body.category : problemFound.category,
    });
    return ;
})

router.delete('/delete/:id', async (req,res) => {
    const id=req.params.id;
    const problemFound=await problem.findById(id);
    if(!problemFound) return ;
    const deleteOp=await problem.findByIdAndDelete(id);
    return ;
})


module.exports=router;