const {
  createHmac,
  randomBytes
} = require("crypto");
const mongoose = require("mongoose");
const {
  createUserToken,
  validateToken
} = require('../services/jsonwebtoken')

let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String
  },
  password: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    default: "../images/profile.png",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = 'someRandomSalt';
  const hashedPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPass
  next()
});


userSchema.static('matchPassAndGenerateToken', async function (email, password) {
  const user = await this.findOne({
    email
  })
  if (!user) throw new Error('No such user')
  const salt = user.salt;
  const pass = user.password
  const userProvidedhash = createHmac('sha256', salt).update(password).digest('hex')
  if (userProvidedhash !== pass) {
    throw new Error('Incorrect password')
  }

  const token = createUserToken(user)
  return token;
})
const User = mongoose.model("user", userSchema);
module.exports = User;