const Post = require('../models/Post');
const User = require('../models/User');
const { uploadPostMedia, cloudinary } = require('../config/cloudinary');

// Créer un post
exports.createPost = (req, res) => {
  uploadPostMedia(req, res, async (err) => {
    if (err) {
      console.error('❌ Erreur upload média:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Erreur lors de l\'upload des médias'
      });
    }

    try {
      const { content } = req.body;
      
      if (!content && (!req.files || req.files.length === 0)) {
        return res.status(400).json({
          success: false,
          error: 'Le post doit contenir du texte ou des médias'
        });
      }

      // Préparer les médias
      const media = req.files ? req.files.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        publicId: file.filename
      })) : [];

      const post = await Post.create({
        author: req.user.id,
        content: content || '',
        media
      });

      // Populer l'auteur
      await post.populate('author', 'name profilePicture jobTitle');

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('❌ Erreur création post:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création du post'
      });
    }
  });
};

// Récupérer tous les posts (feed)
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'name profilePicture jobTitle')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erreur récupération feed:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des posts'
    });
  }
};

// Récupérer les posts d'un utilisateur
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .populate('author', 'name profilePicture jobTitle')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: userId });

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erreur récupération posts utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des posts'
    });
  }
};

// Liker/Unliker un post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post non trouvé'
      });
    }

    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex === -1) {
      // Ajouter un like
      post.likes.push({ user: req.user.id });
    } else {
      // Enlever le like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('❌ Erreur like:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du like'
    });
  }
};

// Ajouter un commentaire
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le commentaire ne peut pas être vide'
      });
    }

    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post non trouvé'
      });
    }

    post.comments.push({
      user: req.user.id,
      content: content.trim()
    });

    await post.save();
    
    // Populer le nouveau commentaire
    await post.populate('comments.user', 'name profilePicture');

    res.json({
      success: true,
      data: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error('❌ Erreur commentaire:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout du commentaire'
    });
  }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à supprimer ce post'
      });
    }

    // Supprimer les médias de Cloudinary
    for (const media of post.media) {
      if (media.publicId) {
        await cloudinary.uploader.destroy(media.publicId, {
          resource_type: media.type === 'video' ? 'video' : 'image'
        });
      }
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post supprimé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur suppression post:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du post'
    });
  }
};