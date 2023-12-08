const User = require('./../models/usersModel');
const { promisify } = require('util');
const jwtMethods = require('./jwt/jwt_tokent')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync')


exports.signup =  catchAsync(async( req , res ,next)=>{
  
  if( await User.findOne({ email: req.body.email})){
    return next(new AppError('Already Exist ,Please sign up with new email', 403));
  }
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

});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if  email && password exist
    if (!email || !password) {
      
      return next(new AppError('Please provide email and password!', 400)); //
    }
  
    // 2 ) Check if user exist && password is  correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password!', 401));
    }
  
    //3) If evertything ok, send token to client
    jwtMethods.createSendToken(user, 200, res);
  });
  
  
  exports.protect = catchAsync(async (req, res, next) => {
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
      console.log('not loged in');
      return next(
        new AppError('You are not logedIn ! Please login to get access', 401)
      );
    }
  
    // 2) Verification Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); 

    // 3) Check if user still exists (expires time)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token  does no longer exist'),
        401
      );
    }
  
    // 4) Check if user changed password after the token was released
  
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      // if return true from userModel
      return next(
        new AppError('User recently changed password!Please login again.', 401)
      );
    }
  
    //GRANT ACCESS TO PROETECTED ROUTE
    req.user = currentUser; //
  
    next();
  });
  

  exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1. Get User based on POSTED email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // 2.Generate the random reset token

    const resetToken = user.createPasswordResetToken();
  
    await user.save({ validateBeforeSave: false });
  
    // ------3. Send it(token) to user's email-----
    /*
       ##################
    */
    try {
     
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email / For testing :  you can providen token by simply login    !',
      });
    } catch (err) {

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(
        new AppError(
          'There was an error sending reset url in forget password .Try again leter!',
          500
        )
      );
    }
  });
  
  
  exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
  
    // 2) If token has not expired , and there is a user , set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired ', 400));
    }
  
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
  
    // 3) Update changePasswordAt property for the user
    await user.save();
  
    // 4) Log the user in , send JWT
    jwtMethods.createSendToken(user, 200, res);
  });
  
 
  exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTED current password is correct
  
    //if not equal/pswd wrong
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong', 401));
    }
  
    // 3) if correct , update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
  
    // 4) Log user in , send JWT
    jwtMethods.createSendToken(user, 200, res);
  });


// admin 
  exports.restrictTo = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
      next();
    };
  };
  