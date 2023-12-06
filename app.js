const express = require('express');
const app = express();
const morgan = require('morgan');


app.use((req, res, next)=>{
    console.log("testing..!!!!");
    next();
})
app.get('/', (req, res)=>{
    res.status(200)

})

module.exports = app;