const express = require('express');
const router = express.Router();
const Post = require('../Model/PostModel');
const Comment = require('../Model/CommentModel');
const { protect } = require('../middlewares/authMiddleware');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new post
router.post('/', protect, async (req, res) => {
    const { title, content, tags } = req.body;
    try {
        const post = new Post({
            title,
            content,
            tags,
            author: req.user.id
        });
        await post.save();
        const populatedPost = await Post.findById(post._id)
            .populate('author', 'name email')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name email' }
            });
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a single post with comments
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email').populate({
            path: 'comments',
            populate: { path: 'author', select: 'name email' }
        });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upvote a post
router.post('/:id/upvote', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userId = req.user.id;
        if (post.upvotes.includes(userId)) {
            post.upvotes.pull(userId);
        } else {
            post.upvotes.push(userId);
            post.downvotes.pull(userId);
        }
        await post.save();
        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name email')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name email' }
            });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Downvote a post
router.post('/:id/downvote', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userId = req.user.id;
        if (post.downvotes.includes(userId)) {
            post.downvotes.pull(userId);
        } else {
            post.downvotes.push(userId);
            post.upvotes.pull(userId);
        }
        await post.save();
        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name email')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name email' }
            });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a comment to a post
router.post('/:id/comments', protect, async (req, res) => {
    const { content } = req.body;
    try {
        const comment = new Comment({
            content,
            author: req.user.id,
            post: req.params.id
        });
        await comment.save();

        const post = await Post.findById(req.params.id);
        post.comments.push(comment._id);
        await post.save();

        const populatedComment = await Comment.findById(comment._id).populate('author', 'name email');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;