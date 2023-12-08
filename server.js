const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv') ;



 dotenv.config({path:'./config.env'});

const DataBase = process.env.DATABASE.replace('<PASSWORD>',process.env.DB_PASSWORD);


mongoose
.connect(DataBase,{
  //  useNewUrlParser : true,
   // useNewUrlIndex : true,
    //useFindAndModify : false,
     useUnifiedTopology: true
    
}
)
.then( ()=>  console.log("DB connection  successful..!!"));

const port = process.env.PORT || 3789;

  const server = app.listen(port, ()=>{
      console.log(`Application running on port ${port}...`);   
  }); 