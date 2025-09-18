const studentService = require('../services/studentService');

const studentController = {
  // Create a new student profile
  createStudent: async (req, res) => {
    try {
      const { name, skills, education, location, category, pastParticipation } = req.body;

      // Validation - only skills and location are required
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Skills array is required and cannot be empty'
        });
      }

      if (!location || location.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Location is required'
        });
      }

      const studentData = {
        name: name ? name.trim() : null,
        skills,
        education: education || null,
        location: location.trim(),
        category: category || null,
        past_participation: Boolean(pastParticipation)
      };

      const student = await studentService.createStudentProfile(studentData);

      res.status(201).json({
        success: true,
        message: 'Student profile created successfully',
        data: student  // Changed from 'student' to 'data' to match frontend expectation
      });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create student profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get student by ID
  getStudentById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required'
        });
      }

      const student = await studentService.getStudentById(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.json({
        success: true,
        student
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get recommendations for a student
  getStudentRecommendations: async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 5 } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required'
        });
      }

      const recommendations = await studentService.getRecommendationsForStudent(id, parseInt(limit));

      res.json({
        success: true,
        recommendations,
        count: recommendations.length
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recommendations',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get all students (optional, for admin purposes)
  getAllStudents: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const students = await studentService.getAllStudents(parseInt(limit), offset);

      res.json({
        success: true,
        students,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch students',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Update student profile (optional)
  updateStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required'
        });
      }

      const updatedStudent = await studentService.updateStudent(id, updateData);

      if (!updatedStudent) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.json({
        success: true,
        message: 'Student profile updated successfully',
        student: updatedStudent
      });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update student profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Delete student profile (optional)
  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required'
        });
      }

      const deleted = await studentService.deleteStudent(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.json({
        success: true,
        message: 'Student profile deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete student profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = studentController;
