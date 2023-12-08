const Movie = require('../Models/movieModel');
const User = require('../Models/usersModel');
const Booking = require('../Models/bookingModel')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const codeFactory = require('../controllers/codeFactory');

const seat = [ 1, 2, 3, 4,5,6, 7, 8,9];
let bookedSeats = [];
let vacentSeat = [];
let my_seat;

// to check seat is booked or not
exports.checkSeat = catchAsync(async(req, res, next)=>{
      my_seat = req.body.seatNo

     if(  my_seat > 10 ||  bookedSeat.includes(my_seat)) {
        return next(AppError('Seat is already booked , please try for another seat' ,  404));
     }  
     bookedSeat.push(my_seat);

     next();
})

//to seat available seats numbers
exports.vacentSeats = function Vacentseats(seat,bookedSeat ) {
    vacentSeat = seat.filter(s => !bookedSeat.includes(s));
        return vacentSeat
  }
  
// book seat and movie 
exports.bookMovie = catchAsync( async(req, res, next)=>{
    const user = req.user
    const movie = await Movie.findById({id:req.params})
    if(!user && !movie && !(movie.price === req.body.price)) {
        return next(AppError('Something is wrong! , please try again', 404))
    }
    await Booking.create({user , movie , price,my_seat})
})


exports.getAllBooking = codeFactory.getAll(Booking)