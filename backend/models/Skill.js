const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Développement',
      'Design',
      'Marketing',
      'Gestion de projet',
      'Data Science',
      'Cloud & DevOps',
      'Soft Skills',
      'Leadership',
      'Communication',
      'Autre'
    ]
  },
  level: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'],
    default: 'Intermédiaire'
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endorsements: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  searchCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche
SkillSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Middleware pour mettre à jour updatedAt
SkillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Skill', SkillSchema);