const mongoose=require("mongoose");

const problemSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy","Medium","Hard","Damn Hard!"],
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    bookmark: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default:""
    }
})

const problem=mongoose.model("problem",problemSchema);

module.exports=problem