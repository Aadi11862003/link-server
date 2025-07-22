
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api', // change if needed
});

export default API;
