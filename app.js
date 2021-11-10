//jshint esversion:6
//var userSchema = require('./model/userScheme');
require('dotenv').config();
const encrypt = require('mongoose-encryption');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { password } = require('./model/userScheme');
const app = express();

console.log(process.env.secret);

app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
   extended:true
}));


var url ='mongodb://localhost:27017/userDB';

mongoose.connect(url);

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields:["password"]});




const User = new mongoose.model("User",userSchema);

app.get('/',(req,res)=>{
   res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
 });

 app.get('/register',(req,res)=>{
    res.render('register');
 });

 app.post('/register',(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    });

    newUser.save((err)=>{
        if(err) throw err;

        res.render("secrets");
    });
 });

 app.post('/login',(req,res)=>{
     const useremail = req.body.username;
     const userpass = req.body.password;


     User.findOne({email:useremail},(err,result)=>{
          if(err) throw err;

          if(result){
              if(result.password === userpass){
                  res.render('secrets');
              }
          }
     });
 });


app.listen(3000,()=>{
    console.log("Listening to PORT 3000");
})