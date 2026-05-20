const express=require("express");
const mongoose=require("mongoose");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT=process.env.PORT || 8000;
const app=express();

const userRouter=require("./routes/userRouter");
const problemRouter=require("./routes/problemRouter");

const checkforAuthentication=require('./middleware/auth');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://127.0.0.1:27017/dev-tracker")
.then(() => console.log("MONGODB Connected"))
.catch((e) => console.log("Error Occured", e));


app.use('/api',userRouter);

app.use('/problem',checkforAuthentication,problemRouter);

app.listen(PORT,() => console.log(`Server Running at Port ${PORT}`));