// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mynotemaker.onrender.com' 
  : 'http://localhost:8080';

// Fallback for development if environment variable is not set
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://mynotemaker.onrender.com';
  }
  return 'http://localhost:8080';
};

export default getApiUrl();
