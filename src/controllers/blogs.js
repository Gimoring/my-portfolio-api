const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const uniqueSlug = require('unique-slug');
const Blog = require('../db/models/blog');
const { getAccessToken, getAuth0User } = require('./auth');
exports.getBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find({ status: 'published' }).sort({
			createdAt: -1,
		});
		const { access_token } = await getAccessToken();
		const blogsWithUsers = [];

		for (let blog of blogs) {
			const author = await getAuth0User(access_token)(blog.userId);
			blogsWithUsers.push({ blog, author });
		}
		return res.json(blogsWithUsers);
	} catch (err) {
		return res.json('cannot find data');
	}
};

exports.getBlogsByUser = async (req, res) => {
	const userId = req.user.sub;
	const blogs = await Blog.find({
		userId,
		status: { $in: ['draft', 'published'] },
	});
	return res.json(blogs);
};

exports.getBlogById = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);
		return res.json(blog);
	} catch (err) {
		return res.status(422).json(err.message); //invalid req status
	}
};

exports.getBlogBySlug = async (req, res) => {
	try {
		const blog = await Blog.findOne({ slug: req.params.slug });
		// 엑세스 토큰
		const { access_token } = await getAccessToken();
		//유저 정보
		const author = await getAuth0User(access_token)(blog.userId);
		return res.json({ blog, author });
	} catch (err) {
		return res.status(422).json(err.message); //invalid req status
	}
};

exports.createBlog = async (req, res) => {
	const blogData = req.body;
	blogData.userId = req.user.sub;
	const blog = new Blog(blogData);

	try {
		const createdBlog = await blog.save();
		return res.json(createdBlog);
	} catch (err) {
		return res.status(422).send(err.message);
	}
};

const _saveBlog = async (blog) => {
	try {
		const createdBlog = await blog.save();
		return createdBlog;
	} catch (err) {
		if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
			blog.slug += `-${uniqueSlug()}`;
			return _saveBlog(blog);
		}

		throw err;
	}
};

exports.updateBlog = async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	Blog.findById(id, async (err, blog) => {
		if (err) {
			return res.status(422).send(err.message);
		}
		// 유저가 블로그 퍼블리슁하고있는지, (프론트에서 publish 했다고 데이터 보내준다면) slug 만들기.
		if (body.status === 'published' && !blog.slug) {
			blog.slug = slugify(blog.title, {
				replacement: '-',
				lower: true,
			});
		}
		console.log(blog);

		blog.set(body);
		blog.updateAt = new Date();

		try {
			const updatedBlog = await _saveBlog(blog);
			return res.json(updatedBlog);
		} catch (err) {
			return res.status(422).send(err.message);
		}
	});
};
