// This file should contain the data structures for skills and GitHub projects

const skills = [
  {skill: 'Programming Languages', percent: 13.64, value: 50},
  {skill: 'Web Development', percent: 13.64, value: 90},
  {skill: 'Ai/Ml', percent: 13.64, value: 92},
  {skill: 'DBMS', percent: 9.09, value: 85},
  {skill: 'Problem Solving', percent: 9.09, value: 88},
  {skill: 'DSA', percent: 9.09, value: 80},
  {skill: 'Software engineering & Dev ops', percent: 9.09, value: 85},
  {skill: 'Cloud computing', percent: 4.55, value: 75},
  {skill: 'Operating System', percent: 4.55, value: 70},
  {skill: 'Cyber security', percent: 4.55, value: 80},
  {skill: 'Computer network', percent: 4.55, value: 60},
  {skill: 'IOT', percent: 4.55, value: 40},
  {skill: 'Python', percent: 10, value: 30},
  {skill: 'React JS', percent: 7.14, value: 40}
];

const githubProjects = [
  {
    name: "UpSkill",
    description: "A WebOS application for skill assessment and visualization",
    technologies: ["React", "Node.js", "WebSockets", "Express"],
    url: "https://github.com/user/skillsage"
  },
  {
    name: "AI Code Assistant",
    description: "An AI-powered code assistant with intelligent suggestions",
    technologies: ["Python", "TensorFlow", "NLP", "Flask"],
    url: "https://github.com/user/ai-code-assistant"
  },
  {
    name: "Smart Home IoT Hub",
    description: "Centralized IoT management system for smart homes",
    technologies: ["IoT", "MQTT", "React", "MongoDB"],
    url: "https://github.com/user/smart-home-hub"
  },
  {
    name: "Data Visualization Dashboard",
    description: "Interactive dashboard for complex data visualization",
    technologies: ["D3.js", "React", "Node.js", "PostgreSQL"],
    url: "https://github.com/user/data-viz-dashboard"
  },
  {
    name: "Cloud-Native Microservices",
    description: "Microservices architecture deployed on Kubernetes",
    technologies: ["Docker", "Kubernetes", "Go", "gRPC"],
    url: "https://github.com/user/cloud-microservices"
  }
];

module.exports = {
  skills,
  githubProjects
};