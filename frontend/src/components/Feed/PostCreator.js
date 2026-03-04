import React, { useState, useRef } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useToast } from '../../context/ToastContext';
import { postService } from '../../services/postService';

const PostCreator = ({ user, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Limiter à 5 fichiers
    if (files.length + media.length > 5) {
      toast.error('Maximum 5 fichiers par post');
      return;
    }

    // Valider chaque fichier
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      
      if (!isValidType) toast.error(`${file.name}: Format non supporté`);
      if (!isValidSize) toast.error(`${file.name}: Trop volumineux (max 50MB)`);
      
      return isValidType && isValidSize;
    });

    // Créer les previews
    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      file
    }));

    setMedia([...media, ...validFiles]);
    setMediaPreviews([...mediaPreviews, ...newPreviews]);
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(mediaPreviews[index].url);
    const newMedia = [...media];
    const newPreviews = [...mediaPreviews];
    newMedia.splice(index, 1);
    newPreviews.splice(index, 1);
    setMedia(newMedia);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) {
      toast.error('Votre post doit contenir du texte ou des médias');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('content', content);
    media.forEach(file => formData.append('media', file));

    try {
      const response = await postService.createPost(formData);
      toast.success('Post publié avec succès !');
      setContent('');
      setMedia([]);
      mediaPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      setMediaPreviews([]);
      if (onPostCreated) onPostCreated(response.data.data);
    } catch (error) {
      console.error('Erreur création post:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la publication');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <div className="flex gap-4">
        <img
          src={user?.profilePicture || 'https://via.placeholder.com/40'}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Quoi de neuf ?"
          className="flex-1 p-3 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none dark:bg-slate-800"
          rows="3"
          maxLength="2000"
        />
      </div>

      {/* Previews des médias */}
      {mediaPreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {mediaPreviews.map((preview, index) => (
            <div key={index} className="relative group">
              {preview.type === 'image' ? (
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={preview.url}
                  className="w-full h-24 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaSelect}
          accept="image/*,video/*"
          multiple
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
          disabled={isUploading}
        >
          <span className="material-symbols-outlined">add_photo_alternate</span>
          <span className="text-sm">Ajouter des médias</span>
        </button>

        <Button
          onClick={handleSubmit}
          variant="primary"
          loading={isUploading}
          disabled={!content.trim() && media.length === 0}
        >
          Publier
        </Button>
      </div>
    </Card>
  );
};

export default PostCreator;