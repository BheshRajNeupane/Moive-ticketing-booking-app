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
      my_seat  =  req.body.my_seat


     if(  my_seat > 10 ||  bookedSeats.includes(my_seat)  ) {
        return next( new AppError('  please try for another seat' ,  404));
     }  
     bookedSeats.push(my_seat);

     next();
})

//to seat available seats numbers
exports.vacentSeats =  (async (req , res ,next)=>{ 
    function Vacentseats( a , b) {
       return a.filter(s => !b.includes(s))
     };

       res.status(201).json({
        status:"success",
        data :{
           data:Vacentseats(seat ,bookedSeats)
        }
    })         
  })


  
// book seat and movie 
exports.bookMovie = catchAsync( async(req, res, next)=>{
 
    const currentUser = req.user
    const Bmovie = await Movie.findById(req.params.id)
    const price = req.body.price;
    
    if(!currentUser && !Bmovie && !(Bmovie.price === price)) {
        return next( new AppError('Something is wrong! , please try again', 404))
    }
    console.log(({user: currentUser._id ,  movie: Bmovie._id , price,my_seat}))
    
  const booking =  await Booking.create({user: currentUser._id ,  movie: Bmovie._id , price,my_seat})

             res.status(201).json({
        status:"success",
        data :{
           data: booking
        }
        })  
      
})

// admin can see all booking
exports.getAllBooking = codeFactory.getAll(Booking)