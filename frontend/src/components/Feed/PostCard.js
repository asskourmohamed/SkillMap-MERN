import React, { useState } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useToast } from '../../context/ToastContext';
import { postService } from '../../services/postService';

// Fonction pour formater la date manuellement
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const PostCard = ({ post, currentUser, onPostUpdated }) => {
  const [isLiked, setIsLiked] = useState(
    post.likes?.some(like => like.user?._id === currentUser?._id)
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleLike = async () => {
    try {
      const response = await postService.toggleLike(post._id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Erreur like:', error);
      toast.error('Erreur lors du like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postService.addComment(post._id, commentText);
      setComments([...comments, response.data.data]);
      setCommentText('');
      toast.success('Commentaire ajouté');
    } catch (error) {
      console.error('Erreur commentaire:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce post ?')) return;
    
    try {
      await postService.deletePost(post._id);
      toast.success('Post supprimé');
      if (onPostUpdated) onPostUpdated();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <Card className="mb-4">
      {/* En-tête du post */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.profilePicture || 'https://via.placeholder.com/40'}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {post.author?.name}
            </h4>
            <p className="text-xs text-slate-500">
              {post.author?.jobTitle} • {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>
        
        {post.author?._id === currentUser?._id && (
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        )}
      </div>

      {/* Contenu du post */}
      {post.content && (
        <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Médias */}
      {post.media && post.media.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          post.media.length === 1 ? 'grid-cols-1' :
          post.media.length === 2 ? 'grid-cols-2' :
          post.media.length === 3 ? 'grid-cols-2' :
          'grid-cols-3'
        }`}>
          {post.media.map((media, index) => (
            <div
              key={index}
              className={`relative ${
                post.media.length === 3 && index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(media.url, '_blank')}
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition-colors ${
            isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
          }`}
        >
          <span className="material-symbols-outlined">
            {isLiked ? 'favorite' : 'favorite_border'}
          </span>
          <span className="text-sm">{likesCount}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-slate-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">comment</span>
          <span className="text-sm">{comments.length}</span>
        </button>
      </div>

      {/* Commentaires */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          {/* Liste des commentaires */}
          {comments.map((comment, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <img
                src={comment.user?.profilePicture || 'https://via.placeholder.com/32'}
                alt={comment.user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {comment.user?.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          {/* Formulaire de commentaire */}
          <form onSubmit={handleComment} className="flex gap-3 mt-3">
            <img
              src={currentUser?.profilePicture || 'https://via.placeholder.com/32'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrire un commentaire..."
                className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none dark:bg-slate-800"
                maxLength="500"
              />
              <Button
                type="submit"
                size="small"
                disabled={!commentText.trim() || isSubmitting}
                loading={isSubmitting}
              >
                Envoyer
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};

export default PostCard;