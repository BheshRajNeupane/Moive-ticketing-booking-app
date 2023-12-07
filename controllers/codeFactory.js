const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//Main objective to create this codeFactory is to follow DRY principle and focuses on code reuseabilty.

exports.createOne = Model=>catchAsync (async (req,res,next)=>{  
    const doc = await Model.create(req.body)
        res.status(201).json({
            status:"success",
            data :{
               data:doc
            }
            })   
         });



exports.getAll = Model =>
         catchAsync( async(req,res,next)=>{
            const doc = await Model.find();
                 res.status(200).json({
                 status:'success',
                  result:doc.length,
                 data:{
                data: doc    
                 } 
             });
             
             });   
                   