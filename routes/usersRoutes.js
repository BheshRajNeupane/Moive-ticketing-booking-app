const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');

const userController = require('./../controllers/userController');



router.post ('/signup',  authController.signup)
router.post ('/login',  authController.login)
router.post ('/forgetPassword', authController.forgotPassword)
router.patch ('/resetPassword/:token',  authController.resetPassword)

router.use(authController.protect) 

router.patch('/updateMyPassword', authController.updatePassword);


router.use(authController.restrictTo('admin'))

router.get('/allusers',userController.getAllusers)


module.exports = router;
