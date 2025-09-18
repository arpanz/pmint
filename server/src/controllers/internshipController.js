const internshipService = require('../services/internshipService');

const internshipController = {
  // Create a new internship
  createInternship: async (req, res) => {
    try {
      const { title, description, required_skills, sector, location, capacity } = req.body;

      // Validation
      if (!title || !description || !required_skills || !sector || !location) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, description, required_skills, sector, location'
        });
      }

      if (!Array.isArray(required_skills) || required_skills.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Required skills must be a non-empty array'
        });
      }

      const internshipData = {
        title: title.trim(),
        description: description.trim(),
        required_skills,
        sector,
        location,
        capacity: capacity || null
      };

      const internship = await internshipService.createInternship(internshipData);

      res.status(201).json({
        success: true,
        message: 'Internship created successfully',
        internship
      });
    } catch (error) {
      console.error('Error creating internship:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create internship',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get all internships
  getAllInternships: async (req, res) => {
    try {
      const { page = 1, limit = 20, sector, location } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const filters = {};
      if (sector) filters.sector = sector;
      if (location) filters.location = location;

      const internships = await internshipService.getAllInternships(parseInt(limit), offset, filters);

      res.json({
        success: true,
        internships,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching internships:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch internships',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get internship by ID
  getInternshipById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Internship ID is required'
        });
      }

      const internship = await internshipService.getInternshipById(id);

      if (!internship) {
        return res.status(404).json({
          success: false,
          message: 'Internship not found'
        });
      }

      res.json({
        success: true,
        internship
      });
    } catch (error) {
      console.error('Error fetching internship:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch internship',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Update internship
  updateInternship: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Internship ID is required'
        });
      }

      const updatedInternship = await internshipService.updateInternship(id, updateData);

      if (!updatedInternship) {
        return res.status(404).json({
          success: false,
          message: 'Internship not found'
        });
      }

      res.json({
        success: true,
        message: 'Internship updated successfully',
        internship: updatedInternship
      });
    } catch (error) {
      console.error('Error updating internship:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update internship',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Delete internship
  deleteInternship: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Internship ID is required'
        });
      }

      const deleted = await internshipService.deleteInternship(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Internship not found'
        });
      }

      res.json({
        success: true,
        message: 'Internship deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting internship:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete internship',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = internshipController;
