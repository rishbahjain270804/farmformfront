import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, API_BASE, RAZORPAY_KEY_ID } from './api'

// Schema for individual crop
const cropSchema = z.object({
  cropName: z.string().min(1, "Crop name is required"),
  cropType: z.string().min(1, "Crop type is required"),
  variety: z.string().optional(),
  areaAllocated: z.string().min(1, "Area is required"),
  sowingDate: z.string().min(1, "Sowing date is required"),
  expectedHarvestDate: z.string().optional(),
  irrigationMethod: z.string().optional(),
  expectedYield: z.string().optional(),
})

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
  crops: z.array(cropSchema).min(1, "At least one crop is required"),
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

// Component for individual crop entry
function CropEntry({ index, crop, register, errors, onRemove, canRemove }) {
  const cropTypes = [
    'Cereal (Rice, Wheat, Maize, etc.)',
    'Pulse (Chickpea, Lentil, Pigeon Pea, etc.)',
    'Vegetable',
    'Fruit',
    'Spice',
    'Oilseed',
    'Cash Crop (Cotton, Sugarcane, etc.)',
    'Forage/Fodder',
    'Medicinal Plant',
    'Other'
  ]

  const irrigationMethods = ['Drip', 'Sprinkler', 'Flood', 'Rainfed', 'Mixed']

  return (
    <div className="border-2 border-green-200 rounded-xl p-5 bg-green-50/30 relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-green-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          Crop Details
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            ✕ Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crop Name */}
        <div>
          <label className="font-medium text-gray-700">
            Crop Name <span className="text-red-600">*</span>
          </label>
          <input
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            placeholder="e.g., Rice, Wheat, Tomato"
            {...register(`crops.${index}.cropName`)}
          />
          {errors.crops?.[index]?.cropName && (
            <p className="text-red-600 text-sm mt-1">{errors.crops[index].cropName.message}</p>
          )}
        </div>

        {/* Crop Type */}
        <div>
          <label className="font-medium text-gray-700">
            Crop Type <span className="text-red-600">*</span>
          </label>
          <select
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            {...register(`crops.${index}.cropType`)}
          >
            <option value="">Select crop type...</option>
            {cropTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.crops?.[index]?.cropType && (
            <p className="text-red-600 text-sm mt-1">{errors.crops[index].cropType.message}</p>
          )}
        </div>

        {/* Variety */}
        <div>
          <label className="font-medium text-gray-700">Variety (Optional)</label>
          <input
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            placeholder="e.g., Basmati, IR-64"
            {...register(`crops.${index}.variety`)}
          />
        </div>

        {/* Area Allocated */}
        <div>
          <label className="font-medium text-gray-700">
            Area Allocated <span className="text-red-600">*</span>
          </label>
          <input
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            placeholder="e.g., 2.5 Acres or 1 Ha"
            {...register(`crops.${index}.areaAllocated`)}
          />
          {errors.crops?.[index]?.areaAllocated && (
            <p className="text-red-600 text-sm mt-1">{errors.crops[index].areaAllocated.message}</p>
          )}
        </div>

        {/* Sowing Date */}
        <div>
          <label className="font-medium text-gray-700">
            Sowing Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            {...register(`crops.${index}.sowingDate`)}
          />
          {errors.crops?.[index]?.sowingDate && (
            <p className="text-red-600 text-sm mt-1">{errors.crops[index].sowingDate.message}</p>
          )}
        </div>

        {/* Expected Harvest Date */}
        <div>
          <label className="font-medium text-gray-700">Expected Harvest Date</label>
          <input
            type="date"
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            {...register(`crops.${index}.expectedHarvestDate`)}
          />
        </div>

        {/* Irrigation Method */}
        <div>
          <label className="font-medium text-gray-700">Irrigation Method</label>
          <select
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            {...register(`crops.${index}.irrigationMethod`)}
          >
            <option value="">Select method...</option>
            {irrigationMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        {/* Expected Yield */}
        <div>
          <label className="font-medium text-gray-700">Expected Yield</label>
          <input
            className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none"
            placeholder="e.g., 30 quintals/acre"
            {...register(`crops.${index}.expectedYield`)}
          />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [backendConnected, setBackendConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [crops, setCrops] = useState([{ id: Date.now() }])
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      registrationDate: new Date().toISOString().slice(0,10),
      livestock: [],
      crops: [{}]
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

  // Crop management functions
  const addCrop = () => {
    setCrops([...crops, { id: Date.now() }])
  }

  const removeCrop = (index) => {
    if (crops.length > 1) {
      const newCrops = crops.filter((_, i) => i !== index)
      setCrops(newCrops)
      // Also update form values
      const currentCrops = watch('crops') || []
      const updatedCrops = currentCrops.filter((_, i) => i !== index)
      setValue('crops', updatedCrops, { shouldValidate: true })
    }
  }

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
                <strong>🚨 Connection Error:</strong> Unable to connect to payment system
                <br />
                <small>Please try refreshing the page</small>
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
                <strong>✅ Connection Established Successfully</strong>
                <br />
                <small>🔴 LIVE PAYMENT SYSTEM ACTIVE</small>
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
              {/* Personal Information Section */}
              <div className="border-l-4 border-blue-500 bg-blue-50/50 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  👤 Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email (required) */}
                  <div className="col-span-1">
                    <label className="font-medium text-gray-700">Email <span className="text-red-600">*</span></label>
                    <input type="email" className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none" placeholder="you@example.com" {...register('email')} />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                  </div>

                  {/* Registration Date */}
                  <div className="col-span-1">
                    <label className="font-medium text-gray-700">Registration Date <span className="text-red-600">*</span></label>
                    <input type="date" className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none" {...register('registrationDate')} />
                    {errors.registrationDate && <p className="text-red-600 text-sm">{errors.registrationDate.message}</p>}
                  </div>

                  {/* Farmer Name */}
                  <div>
                    <label className="font-medium text-gray-700">Farmer Name <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none" {...register('farmerName')} />
                    {errors.farmerName && <p className="text-red-600 text-sm">{errors.farmerName.message}</p>}
                  </div>

                  {/* Father/Spouse Name */}
                  <div>
                    <label className="font-medium text-gray-700">Father / Spouse Name <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none" {...register('fatherSpouseName')} />
                    {errors.fatherSpouseName && <p className="text-red-600 text-sm">{errors.fatherSpouseName.message}</p>}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="font-medium text-gray-700">Contact Number <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none" placeholder="10-15 digits" {...register('contactNumber')} />
                    {errors.contactNumber && <p className="text-red-600 text-sm">{errors.contactNumber.message}</p>}
                  </div>

                  {/* Alternate Email */}
                  <div>
                    <label className="font-medium text-gray-700">Email ID (optional)</label>
                    <input type="email" className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none" placeholder="alternate@example.com" {...register('altEmail')} />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="border-l-4 border-purple-500 bg-purple-50/50 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                  📍 Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Address fields */}
                  <div>
                    <label className="font-medium text-gray-700">Village / Panchayat <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-purple-500 focus:outline-none" {...register('village')} />
                    {errors.village && <p className="text-red-600 text-sm">{errors.village.message}</p>}
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Mandal / Block <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-purple-500 focus:outline-none" {...register('mandal')} />
                    {errors.mandal && <p className="text-red-600 text-sm">{errors.mandal.message}</p>}
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">District <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-purple-500 focus:outline-none" {...register('district')} />
                    {errors.district && <p className="text-red-600 text-sm">{errors.district.message}</p>}
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">State <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-purple-500 focus:outline-none" {...register('state')} />
                    {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
                  </div>

                  {/* Aadhaar / Farmer ID */}
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">Aadhaar / Farmer ID (Optional)</label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-purple-500 focus:outline-none" {...register('aadhaarOrFarmerId')} />
                  </div>
                </div>
              </div>

              {/* Land Information Section */}
              <div className="border-l-4 border-amber-500 bg-amber-50/50 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  🏞️ Land Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Land size */}
                  <div>
                    <label className="font-medium text-gray-700">Total Land (in Acres or Hectares) <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-amber-500 focus:outline-none" placeholder="e.g., 2.5 Acres" {...register('totalLand')} />
                    {errors.totalLand && <p className="text-red-600 text-sm">{errors.totalLand.message}</p>}
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Area Under Natural Farming (Ha) <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-amber-500 focus:outline-none" placeholder="e.g., 1.2" {...register('areaUnderNaturalHa')} />
                    {errors.areaUnderNaturalHa && <p className="text-red-600 text-sm">{errors.areaUnderNaturalHa.message}</p>}
                  </div>
                </div>
              </div>

              {/* Multi-Crop Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                      🌱 Crop Details
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Add details for each crop you cultivate</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCrop}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2"
                  >
                    <span className="text-xl">+</span> Add Another Crop
                  </button>
                </div>

                <div className="space-y-4">
                  {crops.map((crop, index) => (
                    <CropEntry
                      key={crop.id}
                      index={index}
                      crop={crop}
                      register={register}
                      errors={errors}
                      onRemove={removeCrop}
                      canRemove={crops.length > 1}
                    />
                  ))}
                </div>
                
                {errors.crops && typeof errors.crops.message === 'string' && (
                  <p className="text-red-600 text-sm mt-3">{errors.crops.message}</p>
                )}
              </div>

              {/* Farming Practice & Experience Section */}
              <div className="border-l-4 border-teal-500 bg-teal-50/50 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold text-teal-900 mb-4 flex items-center gap-2">
                  🚜 Farming Practice & Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Current Farming Practice */}
                  <div>
                    <label className="font-medium text-gray-700">Current Farming Practice <span className="text-red-600">*</span></label>
                    <select className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-teal-500 focus:outline-none" {...register('currentPractice')}>
                      <option value="Natural">Natural</option>
                      <option value="Organic">Organic</option>
                      <option value="Conventional">Conventional</option>
                      <option value="Chemical">Chemical</option>
                    </select>
                  </div>

                  {/* Years of experience */}
                  <div>
                    <label className="font-medium text-gray-700">Years of Farming Experience <span className="text-red-600">*</span></label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-teal-500 focus:outline-none" placeholder="e.g., 5" {...register('yearsExperience')} />
                    {errors.yearsExperience && <p className="text-red-600 text-sm">{errors.yearsExperience.message}</p>}
                  </div>

                  {/* Irrigation Source */}
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">Irrigation Source <span className="text-red-600">*</span></label>
                    <div className="mt-2 flex gap-4">
                      {['Borewell','Canal','Rainfed'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="radio" value={opt} {...register('irrigationSource')} className="w-4 h-4 text-teal-600" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors.irrigationSource && <p className="text-red-600 text-sm">{errors.irrigationSource.message}</p>}
                  </div>

                  {/* Livestock */}
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">Livestock (if any)</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['POULTRY','AQUA','COW','BUFFALO','GOAT','SHEEP','YAK','CAMEL','None'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(watch('livestock')||[]).includes(opt)}
                            onChange={() => toggleLivestock(opt)}
                            className="w-4 h-4 text-teal-600 rounded"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Training & Support Section */}
              <div className="border-l-4 border-indigo-500 bg-indigo-50/50 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  📚 Training & Support
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Willing to adopt / training */}
                  <div>
                    <label className="font-medium text-gray-700">Willing to Adopt Natural Inputs?</label>
                    <div className="mt-2 flex gap-4">
                      {['Yes','No'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="radio" value={opt} {...register('willingNaturalInputs')} className="w-4 h-4 text-indigo-600" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Training Required?</label>
                    <div className="mt-2 flex gap-4">
                      {['Yes','No'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="radio" value={opt} {...register('trainingRequired')} className="w-4 h-4 text-indigo-600" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Local group */}
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">Local Group Name / SHG / FPO</label>
                    <input className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-indigo-500 focus:outline-none" {...register('localGroup')} />
                  </div>

                  {/* Preferred season */}
                  <div>
                    <label className="font-medium text-gray-700">Preferred Cropping Season</label>
                    <select className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-indigo-500 focus:outline-none" {...register('preferredSeason')}>
                      <option value="">Select…</option>
                      <option value="Kharif">Kharif</option>
                      <option value="Rabi">Rabi</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  {/* Remarks */}
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">Remarks / Comments</label>
                    <textarea rows="3" className="mt-1 w-full border-2 border-gray-300 rounded-lg p-2 focus:border-indigo-500 focus:outline-none" {...register('remarks')} />
                  </div>
                </div>
              </div>

              {/* Payment Agreement Section */}
              <div className="border-2 border-green-500 bg-green-50 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <input type="checkbox" {...register('agreeFee')} className="w-5 h-5 mt-1 text-green-600 rounded" />
                  <div>
                    <p className="font-medium text-gray-800">
                      I agree to pay the registration, certification & support fee of <strong className="text-green-700 text-lg">₹ 300</strong> 
                      <span className="text-red-600"> *</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      This fee covers PGS–India certification, training, field verification, and ongoing market support
                    </p>
                  </div>
                </div>
                {errors.agreeFee && <p className="text-red-600 text-sm mt-2">{errors.agreeFee.message}</p>}
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg shadow-lg disabled:opacity-60 transition-all transform hover:scale-105"
                >
                  {submitting ? '⏳ Processing…' : '💳 Pay ₹300 & Submit Registration'}
                </button>
                <a 
                  href="https://cyanoindia.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-6 py-3 rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold transition-colors"
                >
                  🌐 Learn more at cyanoindia.com
                </a>
              </div>

              {status && (
                <div className={`mt-3 p-4 rounded-xl border-2 ${status.ok ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{status.ok ? '✅' : '❌'}</span>
                    <p className="font-medium">{status.message}</p>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-10 text-sm text-gray-500">
              <p>📞 WhatsApp: <a href="https://wa.me/918331919474" className="text-cyano-700 font-semibold">8331919474</a></p>
              <p>🌐 <a href="https://cyanoindia.com" className="text-cyano-700 font-semibold">cyanoindia.com</a></p>
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
