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


//passWord Change or not after token issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){ // if exists
  
  const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000 , 10); ;

  return   JWTTimestamp < changedTimestamp  // if changed retutn true
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');

this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

return resetToken;
}

module.exports = User;