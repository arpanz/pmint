const supabase = require('./supabaseService');

const internshipService = {
  /**
   * Create a new internship in the database
   * @param {Object} internshipData - Internship data
   * @returns {Object} - Created internship record
   */
  createInternship: async (internshipData) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .insert([{
          title: internshipData.title,
          description: internshipData.description,
          required_skills: internshipData.required_skills,
          sector: internshipData.sector,
          location: internshipData.location,
          capacity: internshipData.capacity,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating internship:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createInternship:', error);
      throw error;
    }
  },

  /**
   * Get internship by ID
   * @param {String} internshipId - Internship ID
   * @returns {Object|null} - Internship record or null if not found
   */
  getInternshipById: async (internshipId) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('id', internshipId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Internship not found
        }
        console.error('Supabase error fetching internship:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getInternshipById:', error);
      throw error;
    }
  },

  /**
   * Get all internships with pagination and optional filters
   * @param {Number} limit - Number of internships per page
   * @param {Number} offset - Number of internships to skip
   * @param {Object} filters - Optional filters (sector, location)
   * @returns {Array} - Array of internship records
   */
  getAllInternships: async (limit = 20, offset = 0, filters = {}) => {
    try {
      let query = supabase
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.sector) {
        query = query.eq('sector', filters.sector);
      }
      if (filters.location) {
        query = query.eq('location', filters.location);
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error fetching internships:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllInternships:', error);
      throw error;
    }
  },

  /**
   * Update internship
   * @param {String} internshipId - Internship ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} - Updated internship record or null if not found
   */
  updateInternship: async (internshipId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .update(updateData)
        .eq('id', internshipId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Internship not found
        }
        console.error('Supabase error updating internship:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateInternship:', error);
      throw error;
    }
  },

  /**
   * Delete internship
   * @param {String} internshipId - Internship ID
   * @returns {Boolean} - True if deleted, false if not found
   */
  deleteInternship: async (internshipId) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .delete()
        .eq('id', internshipId)
        .select();

      if (error) {
        console.error('Supabase error deleting internship:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in deleteInternship:', error);
      throw error;
    }
  },

  /**
   * Get internships by sector
   * @param {String} sector - Sector name
   * @param {Number} limit - Maximum number of internships to return
   * @returns {Array} - Array of internships in the specified sector
   */
  getInternshipsBySector: async (sector, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('sector', sector)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase error fetching internships by sector:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getInternshipsBySector:', error);
      throw error;
    }
  },

  /**
   * Get internships by location
   * @param {String} location - Location name
   * @param {Number} limit - Maximum number of internships to return
   * @returns {Array} - Array of internships in the specified location
   */
  getInternshipsByLocation: async (location, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('location', location)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase error fetching internships by location:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getInternshipsByLocation:', error);
      throw error;
    }
  }
};

module.exports = internshipService;
