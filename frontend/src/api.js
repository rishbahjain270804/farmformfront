import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'xxxxxxxxxxxxxxxx'

export const api = axios.create({
  baseURL: API_BASE,
})
