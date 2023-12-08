const express = require('express');
const app = express();
const userRouter = require('./routes/usersRoutes');
const movieRouter = require('./routes/movieRoutes');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

// app.use((req, res, next)=>{
//     console.log("testing..!!!!");
//     next();
// })
// app.get('/', (req, res)=>{
//     res.status(200)

// })

app.use(express.json({limit:'10kb'}));
app.use(cookieParser())

//Routes
app.use('/api/users' ,userRouter);
app.use('/api/movie' ,movieRouter)



// Error Handaling
app.all( ' * ' , (req,res,next)=>{
    next( new AppError(`Can't find ${req.originalUrl} on this server!`,404));
   });

 
 app.use(globalErrorHandler);

module.exports = app;