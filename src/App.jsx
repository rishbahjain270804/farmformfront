import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, API_BASE, RAZORPAY_KEY_ID } from './api'

const schema = z.object({
  email: z.string().email(),
  registrationDate: z.string().min(1, "Required"),
  farmerName: z.string().min(1, "Required"),
  fatherSpouseName: z.string().min(1, "Required"),
  contactNumber: z.string().min(10).max(15),
  altEmail: z.string().email().or(z.literal('')).optional(),
  village: z.string().min(1, "Required"),
  mandal: z.string().min(1, "Required"),
  district: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  aadhaarOrFarmerId: z.string().optional(),
  totalLand: z.string().min(1, "Required"),
  areaUnderNaturalHa: z.string().min(1, "Required"),
  presentCrop: z.string().optional(),
  sowingDate: z.string().min(1, "Required"),
  harvestingDate: z.string().optional(),
  cropTypes: z.string().min(1, "Required"),
  currentPractice: z.enum(['Natural','Organic','Conventional','Chemical']),
  yearsExperience: z.string().min(1, "Required"),
  irrigationSource: z.enum(['Borewell','Canal','Rainfed']),
  livestock: z.array(z.string()).optional(),
  willingNaturalInputs: z.enum(['Yes','No']),
  trainingRequired: z.enum(['Yes','No']),
  localGroup: z.string().optional(),
  preferredSeason: z.enum(['Kharif','Rabi','Both']).optional(),
  remarks: z.string().optional(),
  agreeFee: z.boolean().refine(v=>v===true, {message:'You must agree to pay ₹300'})
})

function Hero() {
  return (
    <header className="brand-gradient text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center font-bold">🌿</div>
          <h1 className="text-2xl sm:text-3xl font-bold">cyanoindia</h1>
        </div>
        <h2 className="mt-6 text-2xl sm:text-4xl font-extrabold leading-tight">
          Natural & Organic Farming Certification – Farmer Registration Form
        </h2>
        <p className="mt-4 text-white/90 max-w-3xl">
          <strong>🌾 Join India’s Natural Farming Revolution – Register Today!</strong><br/>
          “Grow Natural. Earn More. Get Certified under the National Natural Farming Mission.”
        </p>
        <p className="mt-4 text-white/90 max-w-4xl">
          Every day, our farmers feed the nation. But ask yourself — what are we really eating today?
          Vegetables, fruits, rice, pulses, and wheat that look fresh… but are loaded with chemicals. Soil that
          once gave life is now losing its fertility. Agriculture is shrinking. 👉 When the soil becomes sick, the nation becomes sick.
        </p>
        <p className="mt-4 text-white/90 max-w-4xl">
          Through <strong>PGS–India</strong> under the <strong>National Natural Farming Mission</strong>, every farmer can obtain certification,
          access training on natural inputs, and earn better prices with trusted, verified produce.
        </p>
      </div>
    </header>
  )
}

export default function App() {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [backendConnected, setBackendConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      registrationDate: new Date().toISOString().slice(0,10),
      livestock: []
    }
  })

  // Test backend connectivity on component mount
  useEffect(() => {
    const testConnection = async (retryCount = 0) => {
      try {
        console.log(`🚀 Testing PRODUCTION backend connection (attempt ${retryCount + 1}) to:`, API_BASE)
        
        // Add explicit headers for CORS
        const response = await api.get('/api/test', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        console.log('✅ PRODUCTION backend connection successful:', response.data)
        setBackendConnected(true)
        setConnectionError(null)
      } catch (error) {
        console.error('❌ PRODUCTION backend connection failed:', error)
        
        // Retry up to 3 times with delay
        if (retryCount < 2) {
          console.log(`🔄 Retrying connection in 2 seconds... (${retryCount + 1}/3)`)
          setTimeout(() => testConnection(retryCount + 1), 2000)
          return
        }
        
        setBackendConnected(false)
        let errorMessage = 'Cannot connect to production backend server'
        
        if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error - Backend may be starting up'
        } else if (error.response?.status === 404) {
          errorMessage = 'API endpoint not found - Backend may be updating'
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS policy error - Backend configuration issue'
        }
        
        setConnectionError(errorMessage)
      }
    }
    
    testConnection()
  }, [])

  const onSubmit = async (formData) => {
    setSubmitting(true)
    setStatus(null)
    try {
      console.log('Submitting form data:', formData)
      console.log('API_BASE:', API_BASE)
      console.log('RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID)
      
      // Test backend connectivity first
      console.log('Testing backend connectivity...')
      const healthCheck = await api.get('/health')
      console.log('Backend health check:', healthCheck.data)
      
      const { data } = await api.post('/api/create-order', formData)
      console.log('Order created:', data)
      const { order, registrationId } = data

      console.log('Checking Razorpay availability...')
      console.log('window.Razorpay:', window.Razorpay)
      console.log('typeof window.Razorpay:', typeof window.Razorpay)

      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded')
      }

      console.log('Creating Razorpay options with key:', RAZORPAY_KEY_ID)
      console.log('Order details:', order)

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "cyanoindia",
        description: "Natural Farming Certificate & Support",
        order_id: order.id,
        prefill: {
          name: formData.farmerName,
          email: formData.email,
          contact: formData.contactNumber
        },
        theme: { color: '#2f9737' },
        handler: async function (response) {
          try {
            const verify = await api.post('/api/verify-payment', {
              registrationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            setStatus({ ok: true, message: "Payment verified. Registration completed! We’ll reach out on WhatsApp." })
          } catch (e) {
            console.error(e)
            setStatus({ ok: false, message: "Payment verification failed. Please contact support." })
          }
        },
        modal: {
          ondismiss: function() {
            setStatus({ ok: false, message: "Payment cancelled. You can try again." })
          }
        }
      }

      console.log('Initializing Razorpay with options:', options)
      const rzp = new window.Razorpay(options)
      console.log('Razorpay instance created:', rzp)
      console.log('Opening Razorpay modal...')
      rzp.open()

    } catch (e) {
      console.error('Payment error:', e)
      let errorMessage = "Unable to start payment. Please check your details or try again."
      
      if (e.response) {
        // API error
        console.error('API Error:', e.response.data)
        errorMessage = `API Error: ${e.response.data?.error || e.response.statusText}`
      } else if (e.request) {
        // Network error
        console.error('Network Error:', e.request)
        errorMessage = "Network error. Please check your internet connection."
      } else if (e.message) {
        // Other error
        errorMessage = e.message
      }
      
      setStatus({ ok: false, message: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleLivestock = (value) => {
    const current = watch('livestock') || []
    if (current.includes(value)) {
      setValue('livestock', current.filter(v => v !== value), { shouldValidate: true })
    } else {
      setValue('livestock', [...current, value], { shouldValidate: true })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      
      {/* Connection Status Indicator */}
      {connectionError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>🚨 PRODUCTION Connection Error:</strong> {connectionError}
                <br />
                <small>Backend URL: {API_BASE}</small>
                <br />
                <small>Razorpay Key: {RAZORPAY_KEY_ID}</small>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {backendConnected && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>✅ PRODUCTION Backend Connected Successfully</strong>
                <br />
                <small>Backend: {API_BASE}</small>
                <br />
                <small>Frontend: https://farmformfront.vercel.app</small>
                <br />
                <small>Razorpay: {RAZORPAY_KEY_ID} (Live Keys)</small>
              </p>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white shadow rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold">Get Your PGS–India Natural Farming Certificate for Your Land</h3>
            <p className="mt-2 text-gray-600">
              Your Regional Council will guide training, field verification, certification, and market support.
              <strong> Registration, Certification &amp; support fee: ₹300 only</strong>.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email (required) */}
              <div className="col-span-1">
                <label className="font-medium">Email <span className="text-red-600">*</span></label>
                <input type="email" className="mt-1 w-full border rounded-lg p-2" placeholder="you@example.com" {...register('email')} />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>

              {/* Registration Date */}
              <div className="col-span-1">
                <label className="font-medium">Registration Date <span className="text-red-600">*</span></label>
                <input type="date" className="mt-1 w-full border rounded-lg p-2" {...register('registrationDate')} />
                {errors.registrationDate && <p className="text-red-600 text-sm">{errors.registrationDate.message}</p>}
              </div>

              {/* Farmer Name */}
              <div>
                <label className="font-medium">Farmer Name <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('farmerName')} />
                {errors.farmerName && <p className="text-red-600 text-sm">{errors.farmerName.message}</p>}
              </div>

              {/* Father/Spouse Name */}
              <div>
                <label className="font-medium">Father / Spouse Name <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('fatherSpouseName')} />
                {errors.fatherSpouseName && <p className="text-red-600 text-sm">{errors.fatherSpouseName.message}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className="font-medium">Contact Number <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" placeholder="10-15 digits" {...register('contactNumber')} />
                {errors.contactNumber && <p className="text-red-600 text-sm">{errors.contactNumber.message}</p>}
              </div>

              {/* Alternate Email */}
              <div>
                <label className="font-medium">Email ID (optional)</label>
                <input type="email" className="mt-1 w-full border rounded-lg p-2" placeholder="alternate@example.com" {...register('altEmail')} />
              </div>

              {/* Address fields */}
              <div>
                <label className="font-medium">Village / Panchayat <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('village')} />
                {errors.village && <p className="text-red-600 text-sm">{errors.village.message}</p>}
              </div>
              <div>
                <label className="font-medium">Mandal / Block <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('mandal')} />
                {errors.mandal && <p className="text-red-600 text-sm">{errors.mandal.message}</p>}
              </div>
              <div>
                <label className="font-medium">District <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('district')} />
                {errors.district && <p className="text-red-600 text-sm">{errors.district.message}</p>}
              </div>
              <div>
                <label className="font-medium">State <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('state')} />
                {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
              </div>

              {/* Aadhaar / Farmer ID */}
              <div className="md:col-span-2">
                <label className="font-medium">Aadhaar / Farmer ID (Optional)</label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('aadhaarOrFarmerId')} />
              </div>

              {/* Land size */}
              <div>
                <label className="font-medium">Total Land (in Acres or Hectares) <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" placeholder="e.g., 2.5 Acres" {...register('totalLand')} />
                {errors.totalLand && <p className="text-red-600 text-sm">{errors.totalLand.message}</p>}
              </div>
              <div>
                <label className="font-medium">Area Under Natural Farming (Ha) <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" placeholder="e.g., 1.2" {...register('areaUnderNaturalHa')} />
                {errors.areaUnderNaturalHa && <p className="text-red-600 text-sm">{errors.areaUnderNaturalHa.message}</p>}
              </div>

              {/* Crop fields */}
              <div>
                <label className="font-medium">Present Crop</label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('presentCrop')} />
              </div>
              <div>
                <label className="font-medium">Sowing Date <span className="text-red-600">*</span></label>
                <input type="date" className="mt-1 w-full border rounded-lg p-2" {...register('sowingDate')} />
                {errors.sowingDate && <p className="text-red-600 text-sm">{errors.sowingDate.message}</p>}
              </div>
              <div>
                <label className="font-medium">Harvesting Date</label>
                <input type="date" className="mt-1 w-full border rounded-lg p-2" {...register('harvestingDate')} />
              </div>
              <div>
                <label className="font-medium">Crop Type(s) <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" placeholder="e.g., Rice, Millets" {...register('cropTypes')} />
                {errors.cropTypes && <p className="text-red-600 text-sm">{errors.cropTypes.message}</p>}
              </div>

              {/* Current Farming Practice */}
              <div>
                <label className="font-medium">Current Farming Practice <span className="text-red-600">*</span></label>
                <select className="mt-1 w-full border rounded-lg p-2" {...register('currentPractice')}>
                  <option value="Natural">Natural</option>
                  <option value="Organic">Organic</option>
                  <option value="Conventional">Conventional</option>
                  <option value="Chemical">Chemical</option>
                </select>
              </div>

              {/* Years of experience */}
              <div>
                <label className="font-medium">Years of Farming Experience <span className="text-red-600">*</span></label>
                <input className="mt-1 w-full border rounded-lg p-2" placeholder="e.g., 5" {...register('yearsExperience')} />
                {errors.yearsExperience && <p className="text-red-600 text-sm">{errors.yearsExperience.message}</p>}
              </div>

              {/* Irrigation Source */}
              <div>
                <label className="font-medium">Irrigation Source <span className="text-red-600">*</span></label>
                <div className="mt-2 flex gap-4">
                  {['Borewell','Canal','Rainfed'].map(opt => (
                    <label key={opt} className="inline-flex items-center gap-2">
                      <input type="radio" value={opt} {...register('irrigationSource')} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.irrigationSource && <p className="text-red-600 text-sm">{errors.irrigationSource.message}</p>}
              </div>

              {/* Livestock */}
              <div>
                <label className="font-medium">Livestock (if any)</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['POULTRY','AQUA','COW','BUFFALO','GOAT','SHEEP','YAK','CAMEL','None'].map(opt => (
                    <label key={opt} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(watch('livestock')||[]).includes(opt)}
                        onChange={() => toggleLivestock(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Willing to adopt / training */}
              <div>
                <label className="font-medium">Willing to Adopt Natural Inputs?</label>
                <div className="mt-2 flex gap-4">
                  {['Yes','No'].map(opt => (
                    <label key={opt} className="inline-flex items-center gap-2">
                      <input type="radio" value={opt} {...register('willingNaturalInputs')} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium">Training Required?</label>
                <div className="mt-2 flex gap-4">
                  {['Yes','No'].map(opt => (
                    <label key={opt} className="inline-flex items-center gap-2">
                      <input type="radio" value={opt} {...register('trainingRequired')} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Local group */}
              <div className="md:col-span-2">
                <label className="font-medium">Local Group Name / SHG / FPO</label>
                <input className="mt-1 w-full border rounded-lg p-2" {...register('localGroup')} />
              </div>

              {/* Preferred season */}
              <div>
                <label className="font-medium">Preferred Cropping Season</label>
                <select className="mt-1 w-full border rounded-lg p-2" {...register('preferredSeason')}>
                  <option value="">Select…</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="md:col-span-2">
                <label className="font-medium">Remarks / Comments</label>
                <textarea rows="3" className="mt-1 w-full border rounded-lg p-2" {...register('remarks')} />
              </div>

              {/* Fee agree */}
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" {...register('agreeFee')} />
                <span>For Nature Farming Certificate &amp; Support – <strong>₹ 300</strong> <span className="text-red-600">*</span></span>
              </div>
              {errors.agreeFee && <p className="text-red-600 text-sm md:col-span-2">{errors.agreeFee.message}</p>}

              {/* Submit */}
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-cyano-600 hover:bg-cyano-700 text-white font-semibold disabled:opacity-60"
                >
                  {submitting ? 'Processing…' : 'Pay ₹300 & Submit'}
                </button>
                <a href="https://cyanoindia.com" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl border font-semibold">
                  Learn more at cyanoindia.com
                </a>
              </div>

              {status && (
                <div className={`md:col-span-2 mt-3 p-3 rounded-lg ${status.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {status.message}
                </div>
              )}
            </form>

            <div className="mt-10 text-sm text-gray-500">
              <p>📞 WhatsApp: <a href="https://wa.me/918331919474" className="text-cyano-700 font-semibold">8331919474</a></p>
              <p>🌐 <a href="https://cyanoindia.com" className="text-cyano-700 font-semibold">cyanoindia.com</a></p>
              <p>✉️ rexjain27@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} cyanoindia · PGS–India Natural & Organic Farming Certification support
        </div>
      </footer>
    </div>
  )
}
