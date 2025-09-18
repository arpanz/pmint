const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// POST /api/students - Create a new student profile
router.post('/', studentController.createStudent);

// GET /api/students/:id - Get student by ID
router.get('/:id', studentController.getStudentById);

// GET /api/students/:id/recommendations - Get recommendations for a student
router.get('/:id/recommendations', studentController.getStudentRecommendations);

// GET /api/students - Get all students (optional, for admin purposes)
router.get('/', studentController.getAllStudents);

// PUT /api/students/:id - Update student profile (optional)
router.put('/:id', studentController.updateStudent);

// DELETE /api/students/:id - Delete student profile (optional)
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
