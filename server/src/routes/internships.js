const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');

// POST /api/internships - Create a new internship
router.post('/', internshipController.createInternship);

// GET /api/internships - Get all internships
router.get('/', internshipController.getAllInternships);

// GET /api/internships/:id - Get internship by ID
router.get('/:id', internshipController.getInternshipById);

// PUT /api/internships/:id - Update internship
router.put('/:id', internshipController.updateInternship);

// DELETE /api/internships/:id - Delete internship
router.delete('/:id', internshipController.deleteInternship);

module.exports = router;
