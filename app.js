const express = require('express');
const app = express();
const userRouter = require('./routes/usersRoutes');
const movieRouter = require('./routes/movieRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize') 
const xss = require('xss-clean');
const hpp = require('hpp'); 


// 1)Global Middleware

// to Serve static file
//app.use(express.static(path.join( __dirname, 'public')));

//Set security HTTP headers .
app.use(helmet());

//Development Logging
if(process.env.NODE_ENV ==='development'){
app.use(morgan('dev'))
}


// Implementing Rate Limiting
const limiter =  rateLimit({ //pass to rateLimit fxn
 max:100,
 windowMs:60 * 60 * 1000,
 message:'To many request from this IP , please try again in hour'   
})
app.use( '/api',limiter);


app.use(express.json({limit:'10kb'}));
app.use(cookieParser())


//Data sanitization against NoSQL query injection
app.use(mongoSanitize());


//Data sanitization against XSS
app.use(xss());
 

//Prevent parameter pollution
app.use(
    hpp({
      whitelist:[
       'title',
       'director',
       'casts',
       'showTimes',
       'rRating',
       'Price',
       "script"
    ]
}))



//Routes
app.use('/api/users' ,userRouter);
app.use('/api/movie' ,movieRouter)
app.use('/api/booking' ,bookingRouter)



// Error Handaling
app.all( ' * ' , (req,res,next)=>{
    next( new AppError(`Can't find ${req.originalUrl} on this server!`,404));
   });

 //GloableErrorHandling
 app.use(globalErrorHandler);

module.exports = app;