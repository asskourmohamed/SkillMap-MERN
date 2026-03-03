import React, { useState, useRef } from 'react';

const ImageUploader = ({ 
  currentImage, 
  onUpload, 
  type = 'profile',
  isUploading = false,
  aspectRatio = 'square',
  maxSize = 5, // MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const dimensions = {
    profile: 'w-24 h-24 rounded-full',
    cover: 'w-full h-32 rounded-lg',
    thumbnail: 'w-16 h-16 rounded-lg',
    avatar: 'w-10 h-10 rounded-full',
    custom: ''
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]'
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Réinitialiser les erreurs
    setError(null);

    // Validation du type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Format non supporté. Formats acceptés: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`);
      return;
    }

    // Validation de la taille
    if (file.size > maxSize * 1024 * 1024) {
      setError(`L'image ne doit pas dépasser ${maxSize}MB`);
      return;
    }

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Appeler la fonction d'upload
    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const imageClass = dimensions[type] || dimensions.custom;
  const aspectClass = aspectRatio !== 'square' && type === 'custom' ? aspectRatioClasses[aspectRatio] : '';

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className={`${imageClass} ${aspectClass} bg-primary/10 overflow-hidden border-2 border-primary/30 transition-all group-hover:border-primary`}>
          <img 
            src={preview || currentImage || `https://via.placeholder.com/150?text=${type === 'profile' ? 'Profile' : 'Cover'}`}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
        </div>
        
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className={`absolute inset-0 flex items-center justify-center bg-black/50 ${type === 'profile' ? 'rounded-full' : 'rounded-lg'} opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <span className="material-symbols-outlined text-white text-2xl">
            {isUploading ? 'hourglass_empty' : 'photo_camera'}
          </span>
        </button>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}

      <p className="text-xs text-slate-500 mt-2">
        {isUploading ? 'Upload en cours...' : `Cliquez pour changer (max ${maxSize}MB)`}
      </p>
    </div>
  );
};

export default ImageUploader;