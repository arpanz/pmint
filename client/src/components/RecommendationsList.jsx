// src/components/RecommendationsList.jsx
import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

const RecommendationsList = ({ studentId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!studentId) {
        setError('Student ID is missing. Cannot fetch recommendations.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        const response = await studentAPI.getRecommendations(studentId);
        
        let recommendationsData = response.data?.recommendations || response.data?.data || response.data || [];
        setRecommendations(recommendationsData);
        
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch recommendations.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [studentId]);


  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
        <p className="mt-6 text-lg text-gray-600">Finding your perfect internships...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <h3 className="font-medium">Error Loading Recommendations</h3>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-2 border border-gray-100">
          <p className="text-gray-600 text-sm font-medium">Applications</p>
          <p className="gradient-text text-4xl font-bold">12</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-2 border border-gray-100">
          <p className="text-gray-600 text-sm font-medium">Matches</p>
          <p className="gradient-text text-4xl font-bold">{recommendations.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-2 border border-gray-100">
          <p className="text-gray-600 text-sm font-medium">Interviews</p>
          <p className="gradient-text text-4xl font-bold">1</p>
        </div>
      </div>

      <section>
        <h3 className="text-gray-900 text-2xl font-bold mb-6">Recommended For You</h3>
        {!recommendations || recommendations.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
             <div className="text-6xl mb-4">🔍</div>
             <h3 className="text-xl font-medium text-gray-700 mb-2">No matching internships found</h3>
             <p className="text-gray-500">This could mean there are no internships in the database yet, or none match your profile.</p>
           </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((internship) => (
              <div key={internship._id || internship.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-6 border border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-blue-500">work</span>
                </div>
                <div className="flex-grow">
                   <div className="flex justify-between items-center mb-1">
                     <h4 className="text-gray-900 text-lg font-bold">{internship.title || 'Untitled Internship'}</h4>
                     {internship.isNew && <span className="text-xs font-semibold text-white bg-gradient-to-r from-blue-800 to-blue-500 py-1 px-3 rounded-full">New</span>}
                   </div>
                  <p className="text-gray-600 text-sm mb-3">{internship.company || 'A Company'} · {internship.location || 'Location TBD'}</p>
                  
                  {internship.required_skills && (
                      <div className="flex items-center gap-2 mb-4">
                      {internship.required_skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">{skill}</span>
                      ))}
                      </div>
                  )}

                  <div className="flex gap-2">
                    <button className="text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-sm font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-sm">Apply</button>
                    <button className="text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-800 text-sm font-semibold py-2 px-6 rounded-lg transition-all duration-300">Save</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default RecommendationsList;
