const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Supprimer les anciennes données
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('✅ Anciennes données supprimées');
    
    // Hasher les mots de passe manuellement avant la création
    const salt = await bcrypt.genSalt(10);
    
    // Créer des utilisateurs avec mots de passe hashés manuellement
    const users = [
      {
        name: "Jean Dupont",
        email: "jean.dupont@company.com",
        password: await bcrypt.hash("password123", salt),
        department: "Développement",
        jobTitle: "Lead Full-Stack Developer",
        company: "TechFlow Systems",
        location: "Paris, France",
        bio: "Développeur full-stack passionné avec 8 ans d'expérience.",
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuATPvGJ8NLXfW2ZpfG6onwZx-RSG_oZg80XgZpZ8qEDgVZpSiR9XFRJgoSkaciqVwWfh4UbMAEW4LkdRy5Uvf2V6yqx5paSTTK7VA9Mr0WGUwykkQ3495cxVGvl03Re9qkZyCBhe010QrcP9yzDj3rm0KeAdwZAsoj4Mah_cuQ9z4Msd4JExvEfMmw5p4-VKE98oVweG30H9-g3Yr_0aCZzC9FwKdE2VoZ_VxCEVWKxNn5Wdj2huqEhN2xf9RKuCAvvzntCgXTs7Oif"
      },
      {
        name: "Marie Martin",
        email: "marie.martin@company.com",
        password: await bcrypt.hash("password123", salt),
        department: "Design",
        jobTitle: "Senior UX/UI Designer",
        company: "Creative Studio",
        location: "Bordeaux, France",
        bio: "Designer UX/UI avec une passion pour la création d'expériences utilisateur intuitives.",
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkcJ9S1t6zQT3VXRgVMnPQafFpw_l8XVu0X0G126Mj0kdMOZ1U1aMsFuwAbYrv2FrKIXb86TfM0AquMVODyzplsDAL5McyDz4ryNNAVZGNSA5qnA6q22-dLFH-JG-MNhZaZ5STNPWORyW44JrBYjs73yKyQ_wFAmH0-j-chNFH9999S1hSshu2LP7_7lbdfzYrXzWuPMrLwutfNi8O7lSIVBg3AqnxWSLhXIqK0UkkZvlPdt1h347fVethNPoLrA5DFSngG7vXEWEW"
      },
      {
        name: "Thomas Petit",
        email: "thomas.petit@company.com",
        password: await bcrypt.hash("password123", salt),
        department: "Data",
        jobTitle: "Lead Data Scientist",
        company: "AI Labs",
        location: "Lyon, France",
        bio: "Data Scientist spécialisé en Machine Learning et NLP.",
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuvo26s0ZaEt3TzAuLTdfUZkO5L0NW6Wgizeh2UKJJto3eSf1BHTk1E3C0yMchevLG4rKrc95PpolBDFMfvOdCxPYGSprlPAJyOTiaadPXeq5nBSKyttrXTXKfdjQGfvva5X0ZFDP-L5wc1RJaYaXjMwP1Xsn4GCpg_KaSTdaPl6TmJCOi0ICb2R96PT3UEgRxSs2p5glmx4wncERAEwrH446l1jf146_dNL69uEmnuXlQHFklcQKAnFJYGtO28lu0y2kuovpnknJB"
      }
    ];

    // Sauvegarder les utilisateurs
    const savedUsers = await User.insertMany(users);
    console.log(`✅ ${savedUsers.length} utilisateurs créés`);

    // Créer les profils employés (sans mot de passe)
    const employees = [
      {
        name: "Jean Dupont",
        email: "jean.dupont@company.com",
        age: 32,
        location: "Paris, France",
        bio: "Développeur full-stack passionné avec 8 ans d'expérience.",
        department: "Développement",
        jobTitle: "Lead Full-Stack Developer",
        company: "TechFlow Systems",
        profilePicture: savedUsers[0].profilePicture,
        skills: [
          { name: "React", level: "Avancé", yearsOfExperience: 5 },
          { name: "Node.js", level: "Avancé", yearsOfExperience: 4 },
          { name: "MongoDB", level: "Intermédiaire", yearsOfExperience: 3 }
        ],
        projects: [
          {
            title: "Quantum Analytics Portal",
            description: "Plateforme d'analyse de données en temps réel",
            technologies: ["React", "D3.js", "Node.js"],
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ3MDqmVTz-mhZAckekSjNmVy-g6xjWrQsQ2orEsy7wO_A76FgY3Ryv2zQFzgJcoei1emNfgCRgE3vKeC2TmE8ybkFxbYzJX0VL5LaqPtCvACbrJKPGLdbuLstDwcXfxi_BJlESRVpQruHgeKghXyJbHWDZKHTNmv6QXhTNXEUoq_gqUjvPi4BvaJ4iMshy925N-nMYYGxwo-2M6B5AeSjjZ-nzCj7YEaputBIgaFVl1L39age01Gwek-4fBJXPsbnXdIRysGrJtIz",
            startDate: new Date("2023-01-15"),
            endDate: new Date("2023-12-20"),
            role: "Lead Developer"
          }
        ],
        experiences: [
          {
            title: "Lead Full-Stack Developer",
            company: "TechFlow Systems",
            location: "Paris",
            startDate: new Date("2022-03-01"),
            isCurrent: true,
            description: "Direction d'une équipe de 5 développeurs"
          }
        ]
      },
      {
        name: "Marie Martin",
        email: "marie.martin@company.com",
        age: 28,
        location: "Bordeaux, France",
        bio: "Designer UX/UI passionnée.",
        department: "Design",
        jobTitle: "Senior UX/UI Designer",
        company: "Creative Studio",
        profilePicture: savedUsers[1].profilePicture,
        skills: [
          { name: "Figma", level: "Expert", yearsOfExperience: 6 },
          { name: "UX Research", level: "Avancé", yearsOfExperience: 4 }
        ],
        projects: [
          {
            title: "Banking App Redesign",
            description: "Refonte d'application mobile",
            technologies: ["Figma"],
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDAPzctt4vjQDG40zdxBwatxvqNOj4UeGkRiHjfzN4ULmd2PmrOH4sdZLvXhwTKhjIr-lcaqH6hjPqJbEtslw83dsz3rckaZZh0uLxw7nUmXoCSLEWGBWtE3dEet7k69Fn5V4f19GReyz_t6Y1aM0TvHXOu7M6v5ID_Nah3MwPt_lNxZ2m_2yMzANH9QfUufaDf6jGF5s9KPlTVs255o67N_OUZY13AoGYO7pCWivHscmXUWmwcdktlGIRaxuo9Omr7yXbyuAksO5R",
            startDate: new Date("2023-09-01"),
            endDate: new Date("2024-02-28"),
            role: "Lead UX Designer"
          }
        ],
        experiences: [
          {
            title: "Senior UX/UI Designer",
            company: "Creative Studio",
            location: "Bordeaux",
            startDate: new Date("2021-01-15"),
            isCurrent: true
          }
        ]
      },
      {
        name: "Thomas Petit",
        email: "thomas.petit@company.com",
        age: 35,
        location: "Lyon, France",
        bio: "Data Scientist spécialisé en Machine Learning.",
        department: "Data",
        jobTitle: "Lead Data Scientist",
        company: "AI Labs",
        profilePicture: savedUsers[2].profilePicture,
        skills: [
          { name: "Python", level: "Expert", yearsOfExperience: 8 },
          { name: "Machine Learning", level: "Avancé", yearsOfExperience: 6 }
        ],
        projects: [
          {
            title: "Prédiction de désabonnement clients",
            description: "Modèle ML pour prédire le churn client",
            technologies: ["Python", "scikit-learn"],
            startDate: new Date("2023-05-01"),
            endDate: new Date("2023-11-30"),
            role: "Data Scientist"
          }
        ]
      }
    ];

    await Employee.insertMany(employees);
    console.log(`✅ ${employees.length} profils employés créés`);

    console.log('\n=== IDENTIFIANTS DE CONNEXION ===');
    savedUsers.forEach(user => {
      console.log(`\n${user.name}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Mot de passe: password123`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Base de données initialisée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedDatabase();