import axios from 'axios'

// Accept either variable name for safety (some docs/README used a different name)
const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL
export const API_BASE = envBase || 'https://farmformback.onrender.com'

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RT3fwUOLsjptba'
// Note: RAZORPAY_KEY_SECRET should NEVER be exposed in frontend - it's only for backend use

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
