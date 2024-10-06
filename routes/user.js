const {Router} = require('express');
const User = require('../models/user');
const router = Router();

router.get('/signin',(req,res) => {
    return res.render('signin');
})

router.post('/signin', async (req,res) => {
    const {email,password} = req.body;
    // console.log(req.body);
    try
    {
        const token = await User.matchPasswordAndGenerateToken(email,password);
        
        // console.log('Token',token);
        // return res.redirect('/');
        return res.cookie('token',token).redirect('/');
    }
    catch(error)
    {
        return res.render('signin',{
            error:"Incorrect Email or password",
        });
    }
})
router.get('/signup',(req,res) => {
    res.render('signup');
})

router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/");
})

router.post('/signup',async(req,res)=>{
    const {fullName,email,password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    // console.log(req.body);
    return res.redirect('/');
})

module.exports = router;