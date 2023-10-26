const express = require('express');
const routes = require('../controllers/user')
const router = express.Router()
const User = require('../Models/user')




router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/signin', (req, res) => {
    res.render('signin')
})
router.post('/signin', async (req, res) => {
    const { email, password } = req.body
    try {

        const token = await User.matchPassAndGenerateToken(email, password)
        res.cookie("token", token, { httpOnly: true }).redirect('/')
    } catch (error) {
        res.render('signin', { error: 'incorrect password or email' })
    }
})

router.post('/signup', async (req, res) => {
    let { name, email, password } = req.body
    await User.create({ name: name, email: email, password: password })
    res.redirect('/signin')
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/signup')
})

module.exports = router