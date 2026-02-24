const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  // PAS de password ici
  age: Number,
  profilePicture: String,
  coverPicture: String,
  location: String,
  bio: String,
  website: String,
  department: String,
  jobTitle: String,
  company: String,
  
  skills: [{
    name: String,
    level: String,
    description: String,
    yearsOfExperience: Number,
    endorsements: [{
      endorsedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      endorsedAt: { type: Date, default: Date.now }
    }]
  }],
  
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    imageUrl: String,
    projectUrl: String,
    githubUrl: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,
    role: String
  }],
  
  experiences: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,
    description: String
  }],
  
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date
  }],
  
  openForWork: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Employee', EmployeeSchema);