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

mongoose.connect(process.env.MONGO_URL)
.then(e => console.log('MongoDB Connected'));


app.set('view engine','ejs');
app.set('views',path.resolve('./views'));



app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public'))); 

app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Respond with 204 No Content
});

// app.use(express.static(path.join(__dirname, './public')));
// app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));

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