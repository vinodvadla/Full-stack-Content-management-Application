const JWT = require('jsonwebtoken')

const secret = "vinod@7144"

function createUserToken(user) {
    const payload = {
        _id: user._id,
        name:user.name,
        email: user.email,
        profileImg: user.profileImg,
        role: user.role
    }
    const token = JWT.sign(payload, secret)
    return token;
}

function validateToken(token) {
    const payload=JWT.verify(token, secret)
    return payload
}


module.exports={validateToken,createUserToken}