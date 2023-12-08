const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//Main objective to create this codeFactory is to follow DRY principle and focuses on code reuseabilty.
//doc --> document (   can be movie , ... or other information  )

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
             
             
 exports.updateOne = Model => 
  catchAsync(async(req, res, next)=>{
   
    const doc =  await Model.findByIdAndUpdate(req.params.id,req.body, {
        new:true,
        runValidator:true
       })

    if(!doc){
        return next(new AppError('No document with that ID', 404))
    }
    res.status(200).json({
        status:'success',
        data:{
        
          data: doc
        }
    })

 })


 exports.deleteOne = Model =>
catchAsync( async (req, res, next)=>{
    
    const doc = await Model.findByIdAndDelete(req.params.id)
    
    if(!doc){
        return  next(new AppError('No document found with that ID', 404))
    }
    res.status(204).json({
        status:'success',
        data:null
    })
})

