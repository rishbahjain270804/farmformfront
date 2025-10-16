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
    <header className="bg-green-500 border-b-8 border-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-black text-white grid place-items-center font-bold text-2xl border-4 border-black">
            C
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">cyanoindia</h1>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-6 uppercase">
          Natural & Organic Farming Certification
        </h2>
        <div className="bg-white border-4 border-black p-6 shadow-brutal-lg inline-block max-w-3xl">
          <p className="text-lg font-bold mb-4">
            Join India's Natural Farming Revolution - Register Today!
          </p>
          <p className="text-base leading-relaxed">
            Grow Natural. Earn More. Get Certified under the National Natural Farming Mission.
          </p>
        </div>
        <div className="mt-8 space-y-4 max-w-4xl">
          <p className="text-base leading-relaxed font-medium">
            Every day, our farmers feed the nation. But what are we really eating today?
            Vegetables, fruits, rice, pulses, and wheat that look fresh but are loaded with chemicals. 
            When the soil becomes sick, the nation becomes sick.
          </p>
          <p className="text-base leading-relaxed font-medium">
            Through PGS-India under the National Natural Farming Mission, every farmer can obtain certification,
            access training on natural inputs, and earn better prices with trusted, verified produce.
          </p>
        </div>
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
    <div className="border-4 border-black bg-white p-6 shadow-brutal relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-black uppercase">
          <span className="inline-block w-8 h-8 bg-black text-white text-center leading-8 mr-2 border-2 border-black">
            {index + 1}
          </span>
          Crop Details
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold border-4 border-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all uppercase text-sm"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crop Name */}
        <div>
          <label className="font-bold text-sm uppercase mb-1 block">
            Crop Name <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium"
            placeholder="e.g., Rice, Wheat, Tomato"
            {...register(`crops.${index}.cropName`)}
          />
          {errors.crops?.[index]?.cropName && (
            <p className="text-red-600 text-sm mt-1 font-bold">{errors.crops[index].cropName.message}</p>
          )}
        </div>

        {/* Crop Type */}
        <div>
          <label className="font-bold text-sm uppercase mb-1 block">
            Crop Type <span className="text-red-600">*</span>
          </label>
          <select
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium bg-white"
            {...register(`crops.${index}.cropType`)}
          >
            <option value="">Select crop type...</option>
            {cropTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.crops?.[index]?.cropType && (
            <p className="text-red-600 text-sm mt-1 font-bold">{errors.crops[index].cropType.message}</p>
          )}
        </div>

        {/* Variety */}
        <div>
          <label className="font-bold text-sm uppercase mb-1 block">Variety (Optional)</label>
          <input
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium"
            placeholder="e.g., Basmati, IR-64"
            {...register(`crops.${index}.variety`)}
          />
        </div>

        {/* Area Allocated */}
        <div>
          <label className="font-bold text-sm uppercase mb-1 block">
            Area Allocated <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium"
            placeholder="e.g., 2.5 Acres or 1 Ha"
            {...register(`crops.${index}.areaAllocated`)}
          />
          {errors.crops?.[index]?.areaAllocated && (
            <p className="text-red-600 text-sm mt-1 font-bold">{errors.crops[index].areaAllocated.message}</p>
          )}
        </div>

        {/* Sowing Date */}
        <div>
          <label className="font-bold text-sm uppercase mb-1 block">
            Sowing Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium"
            {...register(`crops.${index}.sowingDate`)}
          />
          {errors.crops?.[index]?.sowingDate && (
            <p className="text-red-600 text-sm mt-1 font-bold">{errors.crops[index].sowingDate.message}</p>
          )}
        </div>

        {/* Expected Harvest Date */}
        <div>
          <label className="font-bold text-sm uppercase mb-1 block">Expected Harvest Date</label>
          <input
            type="date"
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium"
            {...register(`crops.${index}.expectedHarvestDate`)}
          />
        </div>

        {/* Irrigation Method */}
        <div>
          <label className="font-bold text-sm uppercase mb-1 block">Irrigation Method</label>
          <select
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium bg-white"
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
          <label className="font-bold text-sm uppercase mb-1 block">Expected Yield</label>
          <input
            className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium"
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
        console.log(`Testing PRODUCTION backend connection (attempt ${retryCount + 1}) to:`, API_BASE)
        
        const response = await api.get('/api/test', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        console.log('PRODUCTION backend connection successful:', response.data)
        setBackendConnected(true)
        setConnectionError(null)
      } catch (error) {
        console.error('PRODUCTION backend connection failed:', error)
        
        if (retryCount < 2) {
          console.log(`Retrying connection in 2 seconds... (${retryCount + 1}/3)`)
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
            setStatus({ ok: true, message: "Payment verified. Registration completed! We'll reach out on WhatsApp." })
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
        console.error('API Error:', e.response.data)
        errorMessage = `API Error: ${e.response.data?.error || e.response.statusText}`
      } else if (e.request) {
        console.error('Network Error:', e.request)
        errorMessage = "Network error. Please check your internet connection."
      } else if (e.message) {
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
        <div className="bg-red-400 border-4 border-black p-4 mx-6 mt-4 shadow-brutal">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-black text-white font-black text-center leading-6">!</div>
            </div>
            <div>
              <p className="font-bold text-black">
                Connection Error: Unable to connect to payment system
                <br />
                <span className="text-sm font-medium">Please try refreshing the page</span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {backendConnected && (
        <div className="bg-green-400 border-4 border-black p-4 mx-6 mt-4 shadow-brutal">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-black text-white font-black text-center leading-6">✓</div>
            </div>
            <div>
              <p className="font-bold text-black">
                Connection Established Successfully
                <br />
                <span className="text-sm font-medium">LIVE PAYMENT SYSTEM ACTIVE</span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white border-8 border-black shadow-brutal-xl p-8">
            <h3 className="text-2xl font-black uppercase mb-3">Get Your PGS-India Natural Farming Certificate</h3>
            <p className="text-base leading-relaxed mb-2">
              Your Regional Council will guide training, field verification, certification, and market support.
            </p>
            <p className="text-lg font-black">
              Registration, Certification & support fee: ₹300 only
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              {/* Personal Information Section */}
              <div className="border-4 border-black bg-blue-200 p-6 shadow-brutal">
                <h3 className="text-xl font-black uppercase mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email (required) */}
                  <div className="col-span-1">
                    <label className="font-bold text-sm uppercase mb-1 block">Email <span className="text-red-600">*</span></label>
                    <input type="email" className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" placeholder="you@example.com" {...register('email')} />
                    {errors.email && <p className="text-red-600 text-sm font-bold">{errors.email.message}</p>}
                  </div>

                  {/* Registration Date */}
                  <div className="col-span-1">
                    <label className="font-bold text-sm uppercase mb-1 block">Registration Date <span className="text-red-600">*</span></label>
                    <input type="date" className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('registrationDate')} />
                    {errors.registrationDate && <p className="text-red-600 text-sm font-bold">{errors.registrationDate.message}</p>}
                  </div>

                  {/* Farmer Name */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Farmer Name <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('farmerName')} />
                    {errors.farmerName && <p className="text-red-600 text-sm font-bold">{errors.farmerName.message}</p>}
                  </div>

                  {/* Father/Spouse Name */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Father / Spouse Name <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('fatherSpouseName')} />
                    {errors.fatherSpouseName && <p className="text-red-600 text-sm font-bold">{errors.fatherSpouseName.message}</p>}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Contact Number <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" placeholder="10-15 digits" {...register('contactNumber')} />
                    {errors.contactNumber && <p className="text-red-600 text-sm font-bold">{errors.contactNumber.message}</p>}
                  </div>

                  {/* Alternate Email */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Email ID (optional)</label>
                    <input type="email" className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" placeholder="alternate@example.com" {...register('altEmail')} />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="border-4 border-black bg-purple-200 p-6 shadow-brutal">
                <h3 className="text-xl font-black uppercase mb-4">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Address fields */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Village / Panchayat <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('village')} />
                    {errors.village && <p className="text-red-600 text-sm font-bold">{errors.village.message}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Mandal / Block <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('mandal')} />
                    {errors.mandal && <p className="text-red-600 text-sm font-bold">{errors.mandal.message}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">District <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('district')} />
                    {errors.district && <p className="text-red-600 text-sm font-bold">{errors.district.message}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">State <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('state')} />
                    {errors.state && <p className="text-red-600 text-sm font-bold">{errors.state.message}</p>}
                  </div>

                  {/* Aadhaar / Farmer ID */}
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm uppercase mb-1 block">Aadhaar / Farmer ID (Optional)</label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('aadhaarOrFarmerId')} />
                  </div>
                </div>
              </div>

              {/* Land Information Section */}
              <div className="border-4 border-black bg-yellow-200 p-6 shadow-brutal">
                <h3 className="text-xl font-black uppercase mb-4">
                  Land Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Land size */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Total Land (in Acres or Hectares) <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" placeholder="e.g., 2.5 Acres" {...register('totalLand')} />
                    {errors.totalLand && <p className="text-red-600 text-sm font-bold">{errors.totalLand.message}</p>}
                  </div>
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Area Under Natural Farming (Ha) <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" placeholder="e.g., 1.2" {...register('areaUnderNaturalHa')} />
                    {errors.areaUnderNaturalHa && <p className="text-red-600 text-sm font-bold">{errors.areaUnderNaturalHa.message}</p>}
                  </div>
                </div>
              </div>

              {/* Multi-Crop Section */}
              <div className="bg-green-300 border-4 border-black p-6 shadow-brutal">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase">
                      Crop Details
                    </h3>
                    <p className="text-sm font-medium mt-1">Add details for each crop you cultivate</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCrop}
                    className="px-4 py-2 bg-black text-white font-black border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm"
                  >
                    + Add Crop
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
                  <p className="text-red-600 text-sm mt-3 font-bold">{errors.crops.message}</p>
                )}
              </div>

              {/* Farming Practice & Experience Section */}
              <div className="border-4 border-black bg-teal-200 p-6 shadow-brutal">
                <h3 className="text-xl font-black uppercase mb-4">
                  Farming Practice & Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Current Farming Practice */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Current Farming Practice <span className="text-red-600">*</span></label>
                    <select className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium bg-white" {...register('currentPractice')}>
                      <option value="Natural">Natural</option>
                      <option value="Organic">Organic</option>
                      <option value="Conventional">Conventional</option>
                      <option value="Chemical">Chemical</option>
                    </select>
                  </div>

                  {/* Years of experience */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Years of Farming Experience <span className="text-red-600">*</span></label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" placeholder="e.g., 5" {...register('yearsExperience')} />
                    {errors.yearsExperience && <p className="text-red-600 text-sm font-bold">{errors.yearsExperience.message}</p>}
                  </div>

                  {/* Irrigation Source */}
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm uppercase mb-1 block">Irrigation Source <span className="text-red-600">*</span></label>
                    <div className="mt-2 flex gap-4">
                      {['Borewell','Canal','Rainfed'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                          <input type="radio" value={opt} {...register('irrigationSource')} className="w-5 h-5 border-2 border-black" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors.irrigationSource && <p className="text-red-600 text-sm font-bold">{errors.irrigationSource.message}</p>}
                  </div>

                  {/* Livestock */}
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm uppercase mb-1 block">Livestock (if any)</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['POULTRY','AQUA','COW','BUFFALO','GOAT','SHEEP','YAK','CAMEL','None'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            checked={(watch('livestock')||[]).includes(opt)}
                            onChange={() => toggleLivestock(opt)}
                            className="w-5 h-5 border-2 border-black"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Training & Support Section */}
              <div className="border-4 border-black bg-indigo-200 p-6 shadow-brutal">
                <h3 className="text-xl font-black uppercase mb-4">
                  Training & Support
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Willing to adopt / training */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Willing to Adopt Natural Inputs?</label>
                    <div className="mt-2 flex gap-4">
                      {['Yes','No'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                          <input type="radio" value={opt} {...register('willingNaturalInputs')} className="w-5 h-5 border-2 border-black" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Training Required?</label>
                    <div className="mt-2 flex gap-4">
                      {['Yes','No'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                          <input type="radio" value={opt} {...register('trainingRequired')} className="w-5 h-5 border-2 border-black" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Local group */}
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm uppercase mb-1 block">Local Group Name / SHG / FPO</label>
                    <input className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('localGroup')} />
                  </div>

                  {/* Preferred season */}
                  <div>
                    <label className="font-bold text-sm uppercase mb-1 block">Preferred Cropping Season</label>
                    <select className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium bg-white" {...register('preferredSeason')}>
                      <option value="">Select...</option>
                      <option value="Kharif">Kharif</option>
                      <option value="Rabi">Rabi</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  {/* Remarks */}
                  <div className="md:col-span-2">
                    <label className="font-bold text-sm uppercase mb-1 block">Remarks / Comments</label>
                    <textarea rows="3" className="w-full border-4 border-black p-2 focus:outline-none focus:shadow-brutal-sm font-medium" {...register('remarks')} />
                  </div>
                </div>
              </div>

              {/* Payment Agreement Section */}
              <div className="border-4 border-black bg-green-400 p-6 shadow-brutal">
                <div className="flex items-start gap-3">
                  <input type="checkbox" {...register('agreeFee')} className="w-6 h-6 mt-1 border-4 border-black" />
                  <div>
                    <p className="font-bold text-lg text-black">
                      I agree to pay the registration, certification & support fee of ₹300
                      <span className="text-red-600"> *</span>
                    </p>
                    <p className="text-sm font-medium text-black mt-1">
                      This fee covers PGS-India certification, training, field verification, and ongoing market support
                    </p>
                  </div>
                </div>
                {errors.agreeFee && <p className="text-red-600 text-sm mt-2 font-bold">{errors.agreeFee.message}</p>}
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-black text-white font-black text-lg shadow-brutal-xl border-4 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all disabled:opacity-60 uppercase"
                >
                  {submitting ? 'Processing...' : 'Pay ₹300 & Submit'}
                </button>
                <a 
                  href="https://cyanoindia.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-6 py-3 border-4 border-black bg-white font-bold shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
                >
                  Learn More
                </a>
              </div>

              {status && (
                <div className={`mt-3 p-4 border-4 border-black shadow-brutal ${status.ok ? 'bg-green-300' : 'bg-red-300'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-2xl font-black">{status.ok ? '✓' : '✗'}</span>
                    <p className="font-bold">{status.message}</p>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-10 text-sm font-medium">
              <p>WhatsApp: <a href="https://wa.me/918331919474" className="font-black underline">8331919474</a></p>
              <p><a href="https://cyanoindia.com" className="font-black underline">cyanoindia.com</a></p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t-8 border-black bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 text-sm font-medium text-center">
          © {new Date().getFullYear()} cyanoindia · PGS-India Natural & Organic Farming Certification support
        </div>
      </footer>
    </div>
  )
}
