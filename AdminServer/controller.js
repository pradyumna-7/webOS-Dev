const { skills, githubProjects } = require('./data');

const getSkills = (req, res) => {
  try {
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills data', error: error.message });
  }
};

const getGithubProjects = (req, res) => {
  try {
    res.status(200).json(githubProjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GitHub projects data', error: error.message });
  }
};

const getAllData = (req, res) => {
  try {
    const allData = {
      skills,
      githubProjects
    };
    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

module.exports = {
  getSkills,
  getGithubProjects,
  getAllData
};
