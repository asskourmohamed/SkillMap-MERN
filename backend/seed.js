const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    await User.deleteMany({});
    console.log('✅ Anciennes données supprimées');
    
    const users = [
      {
        name: "Jean Dupont",
        email: "jean.dupont@company.com",
        password: "password123",
        department: "Développement",
        jobTitle: "Lead Full-Stack Developer",
        company: "TechFlow Systems",
        location: "Paris, France",
        bio: "Développeur full-stack passionné avec 8 ans d'expérience.",
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuATPvGJ8NLXfW2ZpfG6onwZx-RSG_oZg80XgZpZ8qEDgVZpSiR9XFRJgoSkaciqVwWfh4UbMAEW4LkdRy5Uvf2V6yqx5paSTTK7VA9Mr0WGUwykkQ3495cxVGvl03Re9qkZyCBhe010QrcP9yzDj3rm0KeAdwZAsoj4Mah_cuQ9z4Msd4JExvEfMmw5p4-VKE98oVweG30H9-g3Yr_0aCZzC9FwKdE2VoZ_VxCEVWKxNn5Wdj2huqEhN2xf9RKuCAvvzntCgXTs7Oif",
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
        password: "password123",
        department: "Design",
        jobTitle: "Senior UX/UI Designer",
        company: "Creative Studio",
        location: "Bordeaux, France",
        bio: "Designer UX/UI passionnée.",
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkcJ9S1t6zQT3VXRgVMnPQafFpw_l8XVu0X0G126Mj0kdMOZ1U1aMsFuwAbYrv2FrKIXb86TfM0AquMVODyzplsDAL5McyDz4ryNNAVZGNSA5qnA6q22-dLFH-JG-MNhZaZ5STNPWORyW44JrBYjs73yKyQ_wFAmH0-j-chNFH9999S1hSshu2LP7_7lbdfzYrXzWuPMrLwutfNi8O7lSIVBg3AqnxWSLhXIqK0UkkZvlPdt1h347fVethNPoLrA5DFSngG7vXEWEW",
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
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Utilisateur créé: ${user.name}`);
    }

    console.log('\n=== IDENTIFIANTS DE CONNEXION ===');
    users.forEach(user => {
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