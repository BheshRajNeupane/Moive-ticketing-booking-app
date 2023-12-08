const express= require('express');
const bookingController = require('./../controllers/bookingController')
const authController =  require('./../controllers/authController')

const router = express.Router();

router.use(authController.protect)

router.get('/vacentseat' ,bookingController.vacentSeats )


router
.post( '/bookeMovie/:id',bookingController.checkSeat,bookingController.bookMovie
 )
 
router.use(authController.restrictTo('admin'))

router
.get( '/getallBooking/',bookingController.getAllBooking
 )



 module.exports = router