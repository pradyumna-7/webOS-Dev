const express = require("express");
const router = express.Router();
const { getSkills, getGithubProjects, getAllData } = require('./controller');

router.get("/skills", getSkills);

router.get("/github-projects", getGithubProjects);


router.get("/all-data", getAllData);



module.exports  = router;