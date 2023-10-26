const User=require('../Models/user')

const signUppage=(req,res)=>{
    res.render('signup')
}

module.exports = {signUppage}