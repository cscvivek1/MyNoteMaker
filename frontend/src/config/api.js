// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080'
  : 'https://mynotemaker.onrender.com';

console.log('Current hostname:', window.location.hostname);
console.log('Using API URL:', API_BASE_URL);

export default API_BASE_URL;
