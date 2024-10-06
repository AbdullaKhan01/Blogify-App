require('dotenv').config()

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');


const Blog = require('./models/blog');


const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const app = express();
const PORT = process.env.PORT || 8000;

let url = "mongodb+srv://sheryabdullah25072003:RTc5e0KKQ48HLQVP@cluster0.su8q0.mongodb.net/"
mongoose.connect(url).then(e => console.log('MongoDB Connected'));


app.set('view engine','ejs');
app.set('views',path.resolve('./views'));



app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public'))); 


app.get('/',async(req,res) => {
    const allBlogs = await Blog.find({});
    // console.log(req.user);
    res.render('home',{
        user:req.user,
        blogs:allBlogs,
    }); 
})
app.listen(PORT , () => console.log(`Server Started at PORT :${PORT}`));

app.use('/user',userRoute);
app.use('/blog',blogRoute);