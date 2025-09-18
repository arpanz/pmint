const supabase = require('./supabaseService');
const { calculateMatchScore, generateMatchReason } = require('../utils/scoring');

const studentService = {
  /**
   * Create a new student profile in the database
   * @param {Object} studentData - Student profile data
   * @returns {Object} - Created student record
   */
  createStudentProfile: async (studentData) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: studentData.name,
          skills: studentData.skills,
          education: studentData.education,
          location: studentData.location,
          category: studentData.category,
          past_participation: studentData.past_participation,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating student:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createStudentProfile:', error);
      throw error;
    }
  },

  /**
   * Get student by ID
   * @param {String} studentId - Student ID
   * @returns {Object|null} - Student record or null if not found
   */
  getStudentById: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Student not found
        }
        console.error('Supabase error fetching student:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getStudentById:', error);
      throw error;
    }
  },

  /**
   * Get all students with pagination
   * @param {Number} limit - Number of students per page
   * @param {Number} offset - Number of students to skip
   * @returns {Array} - Array of student records
   */
  getAllStudents: async (limit = 10, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Supabase error fetching students:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllStudents:', error);
      throw error;
    }
  },

  /**
   * Update student profile
   * @param {String} studentId - Student ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} - Updated student record or null if not found
   */
  updateStudent: async (studentId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', studentId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Student not found
        }
        console.error('Supabase error updating student:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateStudent:', error);
      throw error;
    }
  },

  /**
   * Delete student profile
   * @param {String} studentId - Student ID
   * @returns {Boolean} - True if deleted, false if not found
   */
  deleteStudent: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
        .select();

      if (error) {
        console.error('Supabase error deleting student:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in deleteStudent:', error);
      throw error;
    }
  },

  /**
   * Get personalized internship recommendations for a student
   * @param {String} studentId - Student ID
   * @param {Number} limit - Maximum number of recommendations to return
   * @returns {Array} - Array of recommended internships with match scores
   */
  getRecommendationsForStudent: async (studentId, limit = 5) => {
    try {
      // First, get the student profile
      const student = await studentService.getStudentById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // Get all available internships
      const { data: internships, error: internshipsError } = await supabase
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      if (internshipsError) {
        console.error('Supabase error fetching internships:', internshipsError);
        throw new Error(`Database error: ${internshipsError.message}`);
      }

      if (!internships || internships.length === 0) {
        return [];
      }

      // Calculate match scores for each internship
      const scoredInternships = internships.map(internship => {
        const scoreData = calculateMatchScore(student, internship);
        const matchReason = generateMatchReason(student, internship, scoreData.breakdown);

        return {
          ...internship,
          match_score: scoreData.totalScore,
          score_breakdown: scoreData.breakdown,
          match_reason: matchReason
        };
      });

      // Sort by match score (highest first) and return top recommendations
      const recommendations = scoredInternships
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, limit);

      return recommendations;
    } catch (error) {
      console.error('Error in getRecommendationsForStudent:', error);
      throw error;
    }
  }
};

module.exports = studentService;
