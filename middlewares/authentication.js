const User = require("../Models/user")
const {validateToken} = require("../services/jsonwebtoken")
const {createHmac} = require('crypto')

function checkAuthenticationCookie(cookie) {
    return(req, res, next) => {
        let cookieValue = req.cookies[cookie]
        if (! cookieValue) {
            return next()
        }
        try {
            const UserPayload = validateToken(cookieValue)
            req.user = UserPayload
        } catch (error) {}
        return next()
    }
}

module.exports = {
    checkAuthenticationCookie
}


const createHmacsalt = async (req, res, next) => {
    let {name, email, salt, password} = req.body
    const random = 'someRandomSalt';
    const hashedPass = createHmac("sha256", salt).update(password).digest("hex");
    await User.create({name, email, password: hashedPass, salt: random})
    next()
}
