const mongoose=require("mongoose");

const problemSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy","medium","hard","damn hard!"],
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
    }
})

const problem=mongoose.model("problem",problemSchema);

module.exports=problem