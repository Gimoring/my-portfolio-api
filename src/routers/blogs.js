const express = require('express');
const router = express.Router();

const { checkJwt, checkRole } = require('../controllers/auth');
const {
	getBlogs,
	getBlogsByUser,
	getBlogById,
	getBlogBySlug,
	createBlog,
	updateBlog,
} = require('../controllers/blogs');

router.get('/blogs', getBlogs);
router.get('/blogs/me', checkJwt, checkRole('admin'), getBlogsByUser);
router.get('/blogs/:id', getBlogById);
router.get('/blogs/s/:slug', getBlogBySlug);

router.post('/blogs', checkJwt, checkRole('admin'), createBlog);

router.patch('/blogs/:id', checkJwt, checkRole('admin'), updateBlog);

module.exports = router;
