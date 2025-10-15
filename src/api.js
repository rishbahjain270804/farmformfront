import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://farmformback.onrender.com'
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RT3fwUOLsjptba'
export const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'DgXEOyCIrisBmePTZZwdibcR'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
