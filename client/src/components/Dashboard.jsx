import React, { useState, useEffect } from 'react';
import { studentAPI, internshipAPI } from '../services/api';

const Dashboard = ({ student, onBack }) => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await internshipAPI.getAll();
      console.log('Internships response:', response.data);
      
      // Fix: Handle your backend response structure
      const allInternships = response.data.internships || []; // Your backend returns 'internships', not 'data'
      
      // Simple keyword matching
      const matchedInternships = allInternships.map(internship => {
        const skillMatches = student.skills.filter(skill =>
          internship.required_skills?.some(req => 
            req.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(req.toLowerCase())
          )
        );
        
        const locationMatch = student.location === internship.location;
        const matchScore = skillMatches.length * 20 + (locationMatch ? 20 : 0);
        
        return {
          ...internship,
          matchScore: Math.max(matchScore, 10), // Minimum 10% match
          matchedSkills: skillMatches
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      setInternships(matchedInternships);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading internships...</div>;

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Internship Dashboard</h1>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>

      <div className="student-info">
        <h2>Student: {student.name}</h2>
        <p><strong>Skills:</strong> {student.skills.join(', ')}</p>
        <p><strong>Location:</strong> {student.location}</p>
        <p><strong>Education:</strong> {student.education || 'Not specified'}</p>
        <p><strong>Category:</strong> {student.category || 'General'}</p>
      </div>

      <div className="internships">
        <h3>Available Internships ({internships.length})</h3>
        
        {internships.length === 0 ? (
          <div className="no-internships">
            <p>No internships found in the database.</p>
            <p>Please add some internships first or check your backend connection.</p>
          </div>
        ) : (
          <div className="internship-grid">
            {internships.map(internship => (
              <div key={internship.id} className="internship-card">
                <div className="card-header">
                  <h4>{internship.title}</h4>
                  <span className="match-score">{internship.matchScore}% match</span>
                </div>
                
                <p>{internship.description}</p>
                
                <div className="card-details">
                  <div><strong>Sector:</strong> {internship.sector}</div>
                  <div><strong>Location:</strong> {internship.location}</div>
                  <div><strong>Capacity:</strong> {internship.capacity || 'Not specified'}</div>
                </div>

                <div className="skills">
                  <strong>Required Skills:</strong>
                  <div className="skill-tags">
                    {internship.required_skills?.map(skill => (
                      <span 
                        key={skill} 
                        className={`skill-tag ${internship.matchedSkills?.includes(skill) ? 'matched' : ''}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
