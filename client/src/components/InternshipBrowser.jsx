import React, { useState, useEffect } from 'react';
import { internshipAPI } from '../services/api';

const InternshipBrowser = ({ onSignUp }) => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const response = await internshipAPI.getAll();
        // The API returns an object with an 'internships' array
        setInternships(response.data.internships || []);
      } catch (err) {
        setError('Could not fetch internships. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const getMatchBadge = (matchScore) => {
    const score = matchScore || Math.floor(Math.random() * (98 - 80 + 1)) + 80; // fallback random score
    let colorClasses = 'bg-blue-100 text-blue-800';
    let text = `Match: ${score}%`;

    if (score >= 98) {
        colorClasses = 'bg-green-100 text-green-800';
        text = `Top Match: ${score}%`;
    } else if (score < 90) {
        colorClasses = 'bg-yellow-100 text-yellow-800';
    }

    return (
        <div className={`absolute top-4 right-4 flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${colorClasses}`}>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
            </svg>
            <span>{text}</span>
        </div>
    );
  };


  return (
    <div className="px-10 md:px-20 lg:px-40 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg aria-hidden="true" className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" fillRule="evenodd"></path>
                    </svg>
                </span>
                <input className="form-input w-full rounded-lg border-[#F3F4F6] bg-[#F9FAFB] h-12 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[#3B82F6]" placeholder="Search by keywords (e.g. 'Fintech', 'SaaS')" type="text"/>
            </div>
            <div>
                <select className="form-select w-full rounded-lg border-[#F3F4F6] bg-[#F9FAFB] h-12 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[#3B82F6]">
                    <option>Location</option>
                    <option>San Francisco, CA</option>
                    <option>New York, NY</option>
                    <option>Remote</option>
                </select>
            </div>
            <div>
                <select className="form-select w-full rounded-lg border-[#F3F4F6] bg-[#F9FAFB] h-12 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[#3B82F6]">
                    <option>Duration</option>
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>Full-time</option>
                </select>
            </div>
          </div>
        </div>
        
        {loading && <p className="text-center">Loading internships...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {internships.map((internship) => (
                <div key={internship._id || internship.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col relative">
                    {getMatchBadge(internship.matchScore)}
                    <div className="p-6 flex-grow">
                    <h3 className="text-lg font-bold text-gray-900">{internship.title}</h3>
                    <p className="text-base text-gray-600 mt-1">{internship.company || 'A Company'}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {internship.required_skills && internship.required_skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E0F2FE] text-[#1E3A8A]">{skill}</span>
                        ))}
                    </div>
                    </div>
                    <div className="p-6 bg-[#F9FAFB] border-t border-[#F3F4F6]">
                        <button onClick={onSignUp} className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-center rounded-lg h-11 px-6 text-base font-bold shadow-sm hover:opacity-90 transition-opacity">
                            Apply Now
                        </button>
                    </div>
                </div>
                ))}
            </div>
             <div className="flex items-center justify-center mt-12">
                <nav aria-label="Pagination" className="flex items-center space-x-2">
                    <a className="flex items-center justify-center h-10 w-10 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" href="#">
                        <span className="sr-only">Previous</span>
                        <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" fillRule="evenodd"></path></svg>
                    </a>
                    <a aria-current="page" className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold text-sm" href="#">1</a>
                    <a className="flex items-center justify-center h-10 w-10 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors" href="#">2</a>
                    <a className="flex items-center justify-center h-10 w-10 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors" href="#">3</a>
                    <span className="flex items-center justify-center h-10 w-10 text-gray-600">...</span>
                    <a className="flex items-center justify-center h-10 w-10 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors" href="#">10</a>
                    <a className="flex items-center justify-center h-10 w-10 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" href="#">
                        <span className="sr-only">Next</span>
                        <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" fillRule="evenodd"></path></svg>
                    </a>
                </nav>
            </div>
            </>
        )}
      </div>
    </div>
  );
};

export default InternshipBrowser;