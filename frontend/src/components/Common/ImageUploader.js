import React, { useState } from 'react';

const ImageUploader = ({ 
  currentImage, 
  onUpload, 
  type = 'profile', // 'profile' ou 'cover'
  isUploading 
}) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
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

  const dimensions = type === 'profile' 
    ? 'w-24 h-24 rounded-full' 
    : 'w-full h-32 rounded-lg';

  return (
    <div className="relative group">
      <div className={`${dimensions} bg-primary/10 overflow-hidden border-2 border-primary/30`}>
        <img 
          src={preview || currentImage || "https://via.placeholder.com/150"}
          alt="Upload"
          className="w-full h-full object-cover"
        />
      </div>
      
      <label className={`absolute inset-0 flex items-center justify-center bg-black/50 ${type === 'profile' ? 'rounded-full' : 'rounded-lg'} opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <span className="material-symbols-outlined text-white">
          {isUploading ? 'hourglass_empty' : 'photo_camera'}
        </span>
      </label>
    </div>
  );
};

export default ImageUploader;