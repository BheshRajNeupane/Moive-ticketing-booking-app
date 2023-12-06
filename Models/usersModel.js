const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'You must have name']
    },
    email:{
        type:String ,
        required:[true , 'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail , 'Please provide valid email']
    },
    role:{
        type:String,
        enum:['general user' , 'admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true , 'Please provide a password'],
        minlength:8,
        select: false 
   },
   passwordConfirm:{
       type:String,
       required:[true,'Please confirm your password'],
       validate:{
           validator:function(el){ // 
               return el=== this.password;

           },
           message:'Password are not same!'
       }
   }, 

   passwordChangedAt: Date,
   passwordResetToken:String,
   passwordResetExpires: Date,
 active:{
   type:Boolean,
   default:true,
   select:false
 }




})

const User = mongoose.model('User' , userSchema);

// checking passwrod
userSchema.methods.correctPassword =  async function(candidatePassword , userPassword){

    return await bcrypt.compare(candidatePassword, userPassword);
    };
    


module.exports = User;