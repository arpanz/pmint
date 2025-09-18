# PM Internship Matching System

This project is a full-stack web application for matching students to project management internships based on their skills, preferences, and location.

## Project Structure

- `client/` — React frontend (with Tailwind CSS)
- `server/` — Node.js/Express backend (Supabase PostgreSQL)
- `shared/` — Shared code and types

## Features
- Student registration and skill selection
- Internship listing and recommendation engine
- Modern, minimal black/white UI
- RESTful API integration

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase account (for database)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/arpanz/pmint.git
   cd pmint
   ```
2. Install dependencies for both client and server:
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```
3. Configure Supabase credentials in `server/.env`:
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start the backend server:
   ```sh
   cd server
   node server.js
   ```
5. Start the frontend:
   ```sh
   cd client
   npm start
   ```

## Usage
- Access the frontend at `http://localhost:3001`
- Backend runs on `http://localhost:5000`

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
