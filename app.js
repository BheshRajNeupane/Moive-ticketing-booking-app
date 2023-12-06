const express = require('express');
const app = express();
const userRouter = require('./routes/usersRoutes');
const morgan = require('morgan');


app.use((req, res, next)=>{
    console.log("testing..!!!!");
    next();
})
app.get('/', (req, res)=>{
    res.status(200)

})

//Routes
app.use('/api/users' ,userRouter);

module.exports = app;