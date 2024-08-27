const express=require('express');
const router=express.Router();
const interviewQuestion=require('../model/interview_question_model');
const mongoose=require('mongoose');

router.get('/',(req,res,next)=>{
    console.log('this is get request');

    try {
    interviewQuestion.find().select("title subtitle _id").exec().then(
        docs=>{
            if(docs.length>0){
                const response={
                    success:true,
                    count:docs.length,
                    products:docs
                }
                res.status(200).json(response);
        }else{
            res.status(404).json({
                success:true,
                message:"No data found"
            });
        }
    }
    )
} catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        error: err.message
    });
}
});


router.post('/',(req,res,next)=>{
    console.log('Request body:', req.body);
    const question=interviewQuestion({
        _id:new mongoose.Types.ObjectId(),
        title:req.body.title,
        subtitle:req.body.subtitle
    });
    question.save().then( 
        result=>{
            console.log('interview question added to the database');
            res.status(200).json({
                success: true,
                message:"interview question added to the database",
                createdProduct:{
                    name:result.title,
                    price:result.subtitle,
                    _id:result._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/interviewquestion'
                    }
                }
            })
        }
    ).catch(err=>{console.log(err)
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});



router.patch('/:interviewquestionid',(req,res,next)=>{
    const id=req.params.interviewquestionid;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }


    try{
        interviewQuestion.findOneAndUpdate({_id:id},{$set:updateOps},).exec().then(
            result=>{
                console.log(result);
                res.status(200).json({
                    success:true,
                    message:"question updated in the database",
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/interviewquestion'
                    }
                })
            }
        ).catch(err=>console.log(err));
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
   
})



router.delete('/:question',(req,res,next)=>{
    const id=req.params.question;

    interviewQuestion.findByIdAndDelete(id).exec()
    .then(result => {
        if (result) {
            res.status(200).json({
                message: "interview question deleted from the database",
                request:{
                    type:"Post",
                    url:"http://localhost:3000/interviewquestion",
                    
                }            });
        } else {
            res.status(404).json({
                message: "Product not found"
            });
        }
    })
    .catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'CastError') {
            res.status(400).json({
                message: "Invalid product ID format"
            });
        } else {
            console.error(err);
            res.status(500).json({
                message: "Internal server error",
                error: err.message // Send error message in case of any other error
            });
        }
    });
})

module.exports=router;


