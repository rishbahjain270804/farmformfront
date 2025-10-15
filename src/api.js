import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://farmformback.onrender.com'
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RTsRWiZCfVmrgI'
export const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET || '7kelrOCQrsbW7c6e6GOduLAy'

export const api = axios.create({
  baseURL: API_BASE,
})
