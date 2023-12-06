const User = require('./../models/usersModel');
const jwtMethods = require('./jwt/jwt_tokent')



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
  jwtMethods.createSendToken(newUser, 201, res);

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


  exports.protect = async (req, res, next) => {
    //1) Getting token and check of it's there (exist)
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      return Error('You are not logedIn ! Please login to get access')
    }
    // console.log(token);
  
    // 2) Verification Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //calling
  
    // 3) Check if user still exists (expires time)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return Error('You are not logedIn ! Please login to get access')
    }
  
    // 4) Check if user changed password after the token was released
  
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      
     return Error('User recently changed password!Please login again')
    }
  
  
    next();
  };

