require('dotenv').config();
const supabase = require('./src/services/supabaseService');

async function setupDatabase() {
  console.log('🔧 Setting up database tables...');

  try {
    const { data: testData, error: testError } = await supabase
      .from('students')
      .select('count', { count: 'exact', head: true });

    if (testError && testError.code === '42P01') {
      console.log('❌ Tables do not exist. Please create them in Supabase.');
      console.log('\n📋 Run this SQL in your Supabase SQL editor:\n');
      
      const sqlScript = `
-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  skills TEXT[] NOT NULL,
  education TEXT,
  location TEXT NOT NULL,
  category TEXT,
  past_participation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create internships table
CREATE TABLE IF NOT EXISTS internships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[],
  sector TEXT,
  location TEXT,
  capacity INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample internships
INSERT INTO internships (title, description, required_skills, sector, location, capacity) VALUES
('Software Developer Intern', 'Join our development team to build modern web applications', ARRAY['JavaScript', 'React', 'Node.js'], 'Technology', 'Bangalore', 5),
('Data Analyst Intern', 'Analyze government data to drive policy decisions', ARRAY['Python', 'Data Analysis', 'SQL'], 'Technology', 'Delhi', 3),
('Digital Marketing Intern', 'Help promote government initiatives through digital channels', ARRAY['Digital Marketing', 'Content Writing'], 'Marketing', 'Mumbai', 4),
('Web Developer Intern', 'Create responsive websites for government departments', ARRAY['HTML/CSS', 'JavaScript', 'React'], 'Technology', 'Hyderabad', 2),
('ML Research Intern', 'Research machine learning applications in governance', ARRAY['Python', 'Machine Learning', 'Data Analysis'], 'Technology', 'Chennai', 3);
      `;
      
      console.log(sqlScript);
      return;
    }

    if (testError) {
      console.error('❌ Database connection error:', testError.message);
      return;
    }

    console.log('✅ Database tables exist and are accessible');

    // Check if we have sample data
    const { data: internships, error: internshipError } = await supabase
      .from('internships')
      .select('count', { count: 'exact', head: true });

    if (!internshipError && internships) {
      console.log(`📊 Found ${internships.length || 0} internships in database`);
      
      if ((internships.length || 0) === 0) {
        console.log('🔄 Adding sample internships...');
        await addSampleInternships();
      }
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

async function addSampleInternships() {
  const sampleInternships = [
    {
      title: 'Software Developer Intern',
      description: 'Join our development team to build modern web applications',
      required_skills: ['JavaScript', 'React', 'Node.js'],
      sector: 'Technology',
      location: 'Bangalore',
      capacity: 5
    },
    {
      title: 'Data Analyst Intern',
      description: 'Analyze government data to drive policy decisions',
      required_skills: ['Python', 'Data Analysis', 'SQL'],
      sector: 'Technology',
      location: 'Delhi',
      capacity: 3
    },
    {
      title: 'Digital Marketing Intern',
      description: 'Help promote government initiatives through digital channels',
      required_skills: ['Digital Marketing', 'Content Writing'],
      sector: 'Marketing',
      location: 'Mumbai',
      capacity: 4
    },
    {
      title: 'Web Developer Intern',
      description: 'Create responsive websites for government departments',
      required_skills: ['HTML/CSS', 'JavaScript', 'React'],
      sector: 'Technology',
      location: 'Hyderabad',
      capacity: 2
    },
    {
      title: 'ML Research Intern',
      description: 'Research machine learning applications in governance',
      required_skills: ['Python', 'Machine Learning', 'Data Analysis'],
      sector: 'Technology',
      location: 'Chennai',
      capacity: 3
    }
  ];

  const { data, error } = await supabase
    .from('internships')
    .insert(sampleInternships)
    .select();

  if (error) {
    console.error('❌ Failed to add sample internships:', error.message);
  } else {
    console.log(`✅ Added ${data.length} sample internships`);
  }
}

// Run setup
setupDatabase();
