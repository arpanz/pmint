import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentStudent, setCurrentStudent] = useState(null);

  const handleStudentSubmit = (student) => {
    setCurrentStudent(student);
  };

  const handleBack = () => {
    setCurrentStudent(null);
  };

  return (
    <div className="app">
      {!currentStudent ? (
        <StudentForm onSubmit={handleStudentSubmit} />
      ) : (
        <Dashboard student={currentStudent} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
