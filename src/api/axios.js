import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // <-- Update this from 5000 to 3000
  withCredentials: true, 
});

export default API;