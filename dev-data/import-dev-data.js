
const fs = require('fs')
const mongoose = require('mongoose');//
 const Movie =  require('../Models/movieModel')

 const User = require('../Models/usersModel')
const dotenv = require('dotenv')// i 
dotenv.config({path:'./config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DB_PASSWORD);

mongoose
.connect(DB,{

    useNewUrlParser : true,

}).then( ()=>{
    
    console.log("DB connection successful!");
});

const movies =  JSON.parse(fs.readFileSync(`${__dirname}/movie.json`,'utf-8'));


//IMPORT DATA INTO DB
const importData = async ()=>{

    try{
          await Movie.create(movies);
          console.log("Data successfull loaded");
      }
   catch(err){
        console.log(err);
    }
    process.exit();
}

//Delete all data from database
const deleteData = async ()=>{
     try{ 
         await Movie.deleteMany();
         console.log("Data successfull deleted!");
        }catch(err){
            console.log(err);
        }
        process.exit();
}

console.log(process.argv);

 
 if(process.argv[2]==='--import'){
     importData();
    }else if(process.argv[2] === '--delete'){
        deleteData();
    }
    //terminal:  node dev-data/import-dev-data.js --delete 

    // node dev-data/import-dev-data.js --import

 