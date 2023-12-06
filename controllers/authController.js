const User = require('./../models/usersModel');


exports.signup = async( req , res ,next)=>{
    // const newUser = await User.create(req.body);
  const newUser = await User.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      passwordConfirm : req.body.passwordConfirm,
      passwordChangedAt:req.body.passwordChangedAt,
      role: req.body.role
  })


}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if  email && password exist
    if (!email || !password) {
      
      return Error('Please provide email and password!'); //
    }
  
    // 2 ) Check if user exist && password is  correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
     return Error('Incorrect email or password!');
    }
  
  
  };