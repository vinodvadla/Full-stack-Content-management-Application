const express = require("express");
const path = require("path");
const Blog = require("./Models/blog");
const app = express();
require('dotenv').config()
const userrouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const {
  checkAuthenticationCookie,
} = require("./middlewares/authentication.js");

const PORT=process.env.PORT ||4000
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"));

// database connection

mongoose
.connect('mongodb+srv://vinodvinod0979:KlwUXQpc4vQBByfR@cluster0.u3odcik.mongodb.net/?retryWrites=true&w=majority',{dbName:"Blogs-DB"})
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(checkAuthenticationCookie("token"));

app.use("/", userrouter);
app.use("/blogs", blogRouter);

app.get("/", async (req, res) => {
  let blogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: blogs,
  });
});
app.listen(PORT, () => {
  console.log("server running on 4000");
});
