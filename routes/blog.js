const express = require('express')
const Blog = require('../Models/blog')
const path = require('path')
const Comment= require('../Models/comment')
const router = express.Router()

router.get("/add-new", (req, res) => {
    res.render('blogs')
})
router.post('/', async (req, res) => {
    const { title, body, coverImgUrl } = req.body
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImgUrl,
    })
    res.redirect(`/blogs/add-new`)
})

router.get('/blog/:id',async(req,res)=>{
    let id=req.params.id
    let blog=await Blog.findOne({_id:id}).populate("createdBy")
    let comments=await Comment.find({blogId:req.params.id}).populate("createdBy")
    res.render('singleBlog',
    {
        blog:blog,
        user:req.user,
        comments,

    })
})
router.post('/comment/:blogId',async(req,res)=>{
let comment=await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id
})
return res.redirect(`/blogs/blog/${req.params.blogId}`)
})
module.exports = router