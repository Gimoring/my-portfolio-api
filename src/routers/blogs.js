const express = require('express');
const router = express.Router();

const { checkJwt, checkRole } = require('../controllers/auth');
const { getBlogs, getBlogById, getBlogBySlug } = require('../controllers/blogs');

router.get('/blogs',  getBlogs);
router.get('/blogs/:id',  getBlogById);
router.get('/blogs/s/:slug',  getBlogBySlug);

module.exports = router;