import React, { useState } from 'react';
import { studentAPI } from '../services/api';

const StudentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    skills: [],
    education: '',
    location: '',
    category: '',
    pastParticipation: false
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 
    'HTML/CSS', 'Flutter', 'Data Analysis', 'Machine Learning',
    'Digital Marketing', 'Content Writing', 'Graphic Design'
  ];

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      removeSkill(skill);
    } else {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await studentAPI.create({
        name: formData.name,
        skills: formData.skills,
        education: formData.education,
        location: formData.location,
        category: formData.category,
        pastParticipation: formData.pastParticipation
      });
      
      onSubmit(response.data.data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Student Registration</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Skills *</label>
          <div className="skill-input-group">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add custom skill"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button type="button" onClick={addSkill} className="add-skill-btn">Add</button>
          </div>
          
          <div className="skill-options">
            {skillOptions.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`skill-option ${formData.skills.includes(skill) ? 'selected' : ''}`}
              >
                {skill}
              </button>
            ))}
          </div>

          {formData.skills.length > 0 && (
            <div className="selected-skills">
              <strong>Selected:</strong>
              {formData.skills.map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Education</label>
          <select
            value={formData.education}
            onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
          >
            <option value="">Select education</option>
            <option value="Bachelor's">Bachelor's Degree</option>
            <option value="Master's">Master's Degree</option>
            <option value="Diploma">Diploma</option>
            <option value="12th">12th Grade</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location *</label>
          <select
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          >
            <option value="">Select location</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Kolkata">Kolkata</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Select category</option>
            <option value="GEN">General</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
          </select>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.pastParticipation}
              onChange={(e) => setFormData(prev => ({ ...prev, pastParticipation: e.target.checked }))}
            />
            I have participated in government internship programs before
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.skills.length || !formData.location}
        >
          {loading ? 'Creating Profile...' : 'Get Internships'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
