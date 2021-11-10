const mongoose= require('mongoose');


const userSchema ={
    email:String,
    password:String
};

module.exports = userSchema;