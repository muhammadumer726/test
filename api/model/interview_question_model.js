const mongoose=require('mongoose')


const interviewQuestion=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true},
    subtitle:{type:String,required:true},
});

module.exports=mongoose.model('interviewQuestion',interviewQuestion)