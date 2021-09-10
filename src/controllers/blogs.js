const mongoose = require('mongoose');
const Blog = require('../db/models/blog');

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({status: 'published'}).sort({createdAt: -1});
    return res.json(blogs);
  } catch (err) {
    return res.json('cannot find data');
  }
}

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.json(blog);
}

exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({slug: req.params.slug});
  return res.json(blog);
}