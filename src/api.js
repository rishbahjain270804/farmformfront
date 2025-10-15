import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://farmformback.onrender.com'
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RTtX1l4LbRBZuw'
export const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET || '5Y66AQEPjZDhEik3pz4kzp6Z'

export const api = axios.create({
  baseURL: API_BASE,
})
