const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const postController = require('../controllers/postController');

router.post('/', protect, postController.createPost);
router.get('/feed', protect, postController.getFeed);
router.get('/user/:userId', protect, postController.getUserPosts);
router.post('/:postId/like', protect, postController.toggleLike);
router.post('/:postId/comment', protect, postController.addComment);
router.delete('/:postId', protect, postController.deletePost);

module.exports = router;