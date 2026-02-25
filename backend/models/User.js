const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Informations d'authentification
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Informations du profil
  profilePicture: String,
  coverPicture: String,
  location: String,
  bio: String,
  website: String,
  department: String,
  jobTitle: String,
  company: String,
  
  // Skills
  skills: [{
    name: { type: String, required: true },
    level: { 
      type: String, 
      enum: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'],
      default: 'Intermédiaire'
    },
    description: String,
    yearsOfExperience: Number,
    endorsements: [{
      endorsedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      endorsedAt: { type: Date, default: Date.now }
    }]
  }],
  
  // Projets
  projects: [{
    title: { type: String, required: true },
    description: String,
    technologies: [String],
    imageUrl: String,
    projectUrl: String,
    githubUrl: String,
    startDate: Date,
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    role: String
  }],
  
  // Expériences
  experiences: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    startDate: Date,
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    description: String
  }],
  
  // Connexions
  connections: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    connectedAt: Date
  }],
  
  // Statistiques
  profileViews: { type: Number, default: 0 },
  openForWork: { type: Boolean, default: true },
  
  // Dates
  lastLogin: Date
}, {
  timestamps: true
});

// Index pour la recherche
UserSchema.index({ name: 'text', 'skills.name': 'text', jobTitle: 'text', company: 'text' });

// Middleware pour hasher le mot de passe
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer le token JWT
UserSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      name: this.name,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);