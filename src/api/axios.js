import axios from 'axios';

const API = axios.create({
  baseURL: 'https://social-media-backend-flax-psi.vercel.app', // Your live Vercel backend URL
  withCredentials: true, 
});

export default API;