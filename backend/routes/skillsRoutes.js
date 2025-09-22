const express = require('express');
const router = express.Router();

const SkillsController = require('../controllers/skills/skillsController'); 

/////////////////////////
// SKILLS
/////////////////////////
router.get('/skills', SkillsController.getAll);
router.get('/skills/:id', SkillsController.getById);
router.post('/skills', SkillsController.create);
router.put('/skills/:id', SkillsController.update);
router.delete('/skills/:id', SkillsController.remove);

module.exports = router;