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
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  registrationDate: z.string().min(1, "Required"),
  farmerName: z.string().min(1, "Required"),
  fatherSpouseName: z.string().min(1, "Required"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").max(15, "Contact number must be at most 15 digits"),
  altEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
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

// Progress Step Component
function ProgressStep({ stepNumber, title, isActive, isCompleted }) {
  return (
    <div className="flex flex-col items-center relative">
      <div className={`w-10 h-10 md:w-12 md:h-12 border-4 border-black font-black text-sm md:text-lg flex items-center justify-center transition-all ${
        isCompleted ? 'bg-green-400 shadow-brutal-sm' : 
        isActive ? 'bg-yellow-300 shadow-brutal-sm scale-110' : 
        'bg-white'
      }`}>
        {isCompleted ? '✓' : stepNumber}
      </div>
      <div className={`mt-2 text-[10px] md:text-xs font-bold text-center max-w-16 md:max-w-20 ${isActive ? 'text-black' : 'text-gray-600'}`}>
        {title}
      </div>
    </div>
  )
}

// Progress Bar Component
function ProgressBar({ currentStep, totalSteps }) {
  const steps = [
    { number: 1, title: 'Personal' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Land' },
    { number: 4, title: 'Crops' },
    { number: 5, title: 'Practice' },
    { number: 6, title: 'Review' }
  ]
  
  return (
    <div className="w-full mb-6 md:mb-8">
      <div className="flex justify-between items-center relative px-2">
        {/* Connection lines */}
        <div className="absolute top-5 md:top-6 left-0 right-0 h-1 bg-gray-300 -z-10 mx-8" />
        <div 
          className="absolute top-5 md:top-6 left-0 h-1 bg-black transition-all duration-500 -z-10 mx-8" 
          style={{ width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - 4rem)` }}
        />
        
        {steps.map((step) => (
          <ProgressStep
            key={step.number}
            stepNumber={step.number}
            title={step.title}
            isActive={currentStep === step.number}
            isCompleted={currentStep > step.number}
          />
        ))}
      </div>
    </div>
  )
}

// Form Input Component
const FormInput = React.forwardRef(({ label, required, error, className = "", ...props }, ref) => {
  return (
    <div className={className}>
      <label className="font-bold text-sm uppercase mb-1 block">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        ref={ref}
        className="w-full border-4 border-black p-2 md:p-3 focus:outline-none focus:shadow-brutal-sm font-medium transition-shadow"
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1 font-bold">{error}</p>}
    </div>
  )
})

// Form Select Component
const FormSelect = React.forwardRef(({ label, required, error, children, className = "", ...props }, ref) => {
  return (
    <div className={className}>
      <label className="font-bold text-sm uppercase mb-1 block">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        ref={ref}
        className="w-full border-4 border-black p-2 md:p-3 focus:outline-none focus:shadow-brutal-sm font-medium bg-white transition-shadow"
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-600 text-sm mt-1 font-bold">{error}</p>}
    </div>
  )
})

function Hero() {
  return (
    <header className="relative bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-b-8 border-black overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 opacity-20 rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-20 rounded-full -ml-24 -mb-24" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Branding */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white grid place-items-center font-black text-2xl md:text-3xl border-4 border-black shadow-brutal-lg">
                C
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">cyanoindia</h1>
                <p className="text-xs md:text-sm font-bold mt-1">Natural Farming Mission</p>
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-black leading-tight mb-4 uppercase">
              Get Certified.<br/>Go Natural.
            </h2>
            <p className="text-sm md:text-base leading-relaxed font-medium max-w-xl mx-auto md:mx-0">
              Join thousands of farmers transforming Indian agriculture through PGS-India certification. 
              Get training, certification, and market access - all in one place.
            </p>
          </div>
          
          {/* Right side - Quick Info Card */}
          <div className="bg-white border-4 border-black p-6 shadow-brutal-xl max-w-sm w-full md:w-auto">
            <div className="text-center mb-4">
              <div className="text-4xl md:text-5xl font-black text-green-600">₹300</div>
              <div className="text-xs md:text-sm font-bold uppercase mt-1">One-time Fee</div>
            </div>
            <div className="space-y-2 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                <span>PGS-India Certification</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                <span>Training & Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                <span>Market Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                <span>Field Verification</span>
              </div>
            </div>
          </div>
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
    <div className="border-4 border-black bg-white p-4 md:p-6 shadow-brutal relative animate-slideIn">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base md:text-lg font-black uppercase flex items-center gap-2">
          <span className="inline-block w-8 h-8 bg-black text-white text-center leading-8 border-2 border-black flex-shrink-0">
            {index + 1}
          </span>
          <span className="hidden sm:inline">Crop Details</span>
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold border-4 border-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all uppercase text-xs md:text-sm"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Crop Name"
          required
          placeholder="e.g., Rice, Wheat, Tomato"
          {...register(`crops.${index}.cropName`)}
          error={errors.crops?.[index]?.cropName?.message}
        />

        <FormSelect
          label="Crop Type"
          required
          {...register(`crops.${index}.cropType`)}
          error={errors.crops?.[index]?.cropType?.message}
        >
          <option value="">Select crop type...</option>
          {cropTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </FormSelect>

        <FormInput
          label="Variety (Optional)"
          placeholder="e.g., Basmati, IR-64"
          {...register(`crops.${index}.variety`)}
        />

        <FormInput
          label="Area Allocated"
          required
          placeholder="e.g., 2.5 Acres or 1 Ha"
          {...register(`crops.${index}.areaAllocated`)}
          error={errors.crops?.[index]?.areaAllocated?.message}
        />

        <FormInput
          label="Sowing Date"
          required
          type="date"
          {...register(`crops.${index}.sowingDate`)}
          error={errors.crops?.[index]?.sowingDate?.message}
        />

        <FormInput
          label="Expected Harvest Date"
          type="date"
          {...register(`crops.${index}.expectedHarvestDate`)}
        />

        <FormSelect
          label="Irrigation Method"
          {...register(`crops.${index}.irrigationMethod`)}
        >
          <option value="">Select method...</option>
          {irrigationMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </FormSelect>

        <FormInput
          label="Expected Yield"
          placeholder="e.g., 30 quintals/acre"
          {...register(`crops.${index}.expectedYield`)}
        />
      </div>
    </div>
  )
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [backendConnected, setBackendConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [crops, setCrops] = useState([{ id: Date.now() }])
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
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
        const response = await api.get('/api/test', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        setBackendConnected(true)
        setConnectionError(null)
      } catch (error) {
        if (retryCount < 2) {
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

  const toggleLivestock = (value) => {
    const current = watch('livestock') || []
    if (current.includes(value)) {
      setValue('livestock', current.filter(v => v !== value), { shouldValidate: true })
    } else {
      setValue('livestock', [...current, value], { shouldValidate: true })
    }
  }

  // Navigation between steps
  const nextStep = async () => {
    let fieldsToValidate = []
    
    switch(currentStep) {
      case 1:
        fieldsToValidate = ['email', 'registrationDate', 'farmerName', 'fatherSpouseName', 'contactNumber']
        break
      case 2:
        fieldsToValidate = ['village', 'mandal', 'district', 'state']
        break
      case 3:
        fieldsToValidate = ['totalLand', 'areaUnderNaturalHa']
        break
      case 4:
        fieldsToValidate = ['crops']
        break
      case 5:
        fieldsToValidate = ['currentPractice', 'yearsExperience', 'irrigationSource', 'willingNaturalInputs', 'trainingRequired']
        break
      default:
        break
    }
    
    const isValid = await trigger(fieldsToValidate)
    
    if (isValid && currentStep < 6) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onSubmit = async (formData) => {
    setSubmitting(true)
    setStatus(null)
    try {
      const healthCheck = await api.get('/health')
      const { data } = await api.post('/api/create-order', formData)
      const { order, registrationId } = data

      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded')
      }

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
            setStatus({ ok: false, message: "Payment verification failed. Please contact support." })
          }
        },
        modal: {
          ondismiss: function() {
            setStatus({ ok: false, message: "Payment cancelled. You can try again." })
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (e) {
      let errorMessage = "Unable to start payment. Please check your details or try again."
      
      if (e.response) {
        errorMessage = `API Error: ${e.response.data?.error || e.response.statusText}`
      } else if (e.request) {
        errorMessage = "Network error. Please check your internet connection."
      } else if (e.message) {
        errorMessage = e.message
      }
      
      setStatus({ ok: false, message: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-blue-200 border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="Email"
                  required
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />

                <FormInput
                  label="Registration Date"
                  required
                  type="date"
                  {...register('registrationDate')}
                  error={errors.registrationDate?.message}
                />

                <FormInput
                  label="Farmer Name"
                  required
                  {...register('farmerName')}
                  error={errors.farmerName?.message}
                />

                <FormInput
                  label="Father / Spouse Name"
                  required
                  {...register('fatherSpouseName')}
                  error={errors.fatherSpouseName?.message}
                />

                <FormInput
                  label="Contact Number"
                  required
                  placeholder="10-15 digits"
                  {...register('contactNumber')}
                  error={errors.contactNumber?.message}
                />

                <FormInput
                  label="Email ID (optional)"
                  type="email"
                  placeholder="alternate@example.com"
                  {...register('altEmail')}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-purple-200 border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-6">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="Village / Panchayat"
                  required
                  {...register('village')}
                  error={errors.village?.message}
                />

                <FormInput
                  label="Mandal / Block"
                  required
                  {...register('mandal')}
                  error={errors.mandal?.message}
                />

                <FormInput
                  label="District"
                  required
                  {...register('district')}
                  error={errors.district?.message}
                />

                <FormInput
                  label="State"
                  required
                  {...register('state')}
                  error={errors.state?.message}
                />

                <FormInput
                  label="Aadhaar / Farmer ID (Optional)"
                  className="md:col-span-2"
                  {...register('aadhaarOrFarmerId')}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-yellow-200 border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-6">Land Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="Total Land (in Acres or Hectares)"
                  required
                  placeholder="e.g., 2.5 Acres"
                  {...register('totalLand')}
                  error={errors.totalLand?.message}
                />

                <FormInput
                  label="Area Under Natural Farming (Ha)"
                  required
                  placeholder="e.g., 1.2"
                  {...register('areaUnderNaturalHa')}
                  error={errors.areaUnderNaturalHa?.message}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-green-300 border-4 border-black p-6 shadow-brutal">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black uppercase">Crop Details</h3>
                  <p className="text-sm font-medium mt-1">Add details for each crop you cultivate</p>
                </div>
                <button
                  type="button"
                  onClick={addCrop}
                  className="px-4 py-2 bg-black text-white font-black border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm whitespace-nowrap"
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
          </div>
        )

      case 5:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-teal-200 border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-6">Farming Practice & Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormSelect
                  label="Current Farming Practice"
                  required
                  {...register('currentPractice')}
                >
                  <option value="Natural">Natural</option>
                  <option value="Organic">Organic</option>
                  <option value="Conventional">Conventional</option>
                  <option value="Chemical">Chemical</option>
                </FormSelect>

                <FormInput
                  label="Years of Farming Experience"
                  required
                  placeholder="e.g., 5"
                  {...register('yearsExperience')}
                  error={errors.yearsExperience?.message}
                />

                <div className="md:col-span-2">
                  <label className="font-bold text-sm uppercase mb-2 block">
                    Irrigation Source <span className="text-red-600">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['Borewell','Canal','Rainfed'].map(opt => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                        <input type="radio" value={opt} {...register('irrigationSource')} className="w-5 h-5 border-2 border-black" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.irrigationSource && <p className="text-red-600 text-sm mt-1 font-bold">{errors.irrigationSource.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-sm uppercase mb-2 block">Livestock (if any)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['POULTRY','AQUA','COW','BUFFALO','GOAT','SHEEP','YAK','CAMEL','None'].map(opt => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={(watch('livestock')||[]).includes(opt)}
                          onChange={() => toggleLivestock(opt)}
                          className="w-5 h-5 border-2 border-black"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-200 border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-6">Training & Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="font-bold text-sm uppercase mb-2 block">Willing to Adopt Natural Inputs?</label>
                  <div className="flex gap-4">
                    {['Yes','No'].map(opt => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                        <input type="radio" value={opt} {...register('willingNaturalInputs')} className="w-5 h-5 border-2 border-black" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-sm uppercase mb-2 block">Training Required?</label>
                  <div className="flex gap-4">
                    {['Yes','No'].map(opt => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-medium">
                        <input type="radio" value={opt} {...register('trainingRequired')} className="w-5 h-5 border-2 border-black" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <FormInput
                  label="Local Group Name / SHG / FPO"
                  className="md:col-span-2"
                  {...register('localGroup')}
                />

                <FormSelect
                  label="Preferred Cropping Season"
                  {...register('preferredSeason')}
                >
                  <option value="">Select...</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Both">Both</option>
                </FormSelect>

                <div className="md:col-span-2">
                  <label className="font-bold text-sm uppercase mb-1 block">Remarks / Comments</label>
                  <textarea 
                    rows="3" 
                    className="w-full border-4 border-black p-2 md:p-3 focus:outline-none focus:shadow-brutal-sm font-medium" 
                    {...register('remarks')} 
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-brutal">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-6 text-center">Review & Submit</h3>
              
              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                  <h4 className="font-black text-sm uppercase mb-2">Personal Info</h4>
                  <p className="text-sm"><span className="font-bold">Name:</span> {watch('farmerName')}</p>
                  <p className="text-sm"><span className="font-bold">Email:</span> {watch('email')}</p>
                  <p className="text-sm"><span className="font-bold">Contact:</span> {watch('contactNumber')}</p>
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                  <h4 className="font-black text-sm uppercase mb-2">Location</h4>
                  <p className="text-sm">{watch('village')}, {watch('mandal')}, {watch('district')}, {watch('state')}</p>
                </div>

                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                  <h4 className="font-black text-sm uppercase mb-2">Land</h4>
                  <p className="text-sm"><span className="font-bold">Total:</span> {watch('totalLand')}</p>
                  <p className="text-sm"><span className="font-bold">Natural Farming:</span> {watch('areaUnderNaturalHa')} Ha</p>
                </div>

                <div className="border-l-4 border-green-500 bg-green-50 p-4">
                  <h4 className="font-black text-sm uppercase mb-2">Crops</h4>
                  <p className="text-sm">{(watch('crops') || []).length} crop(s) added</p>
                </div>
              </div>

              <div className="border-4 border-black bg-green-400 p-6 shadow-brutal mb-6">
                <div className="flex items-start gap-3">
                  <input type="checkbox" {...register('agreeFee')} className="w-6 h-6 mt-1 border-4 border-black flex-shrink-0" />
                  <div>
                    <p className="font-bold text-base md:text-lg text-black">
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

              {status && (
                <div className={`mt-3 p-4 border-4 border-black shadow-brutal ${status.ok ? 'bg-green-300' : 'bg-red-300'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-2xl font-black">{status.ok ? '✓' : '✗'}</span>
                    <p className="font-bold">{status.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <Hero />
      
      {/* Connection Status Indicator */}
      {connectionError && (
        <div className="bg-red-400 border-4 border-black p-4 mx-4 md:mx-6 mt-4 shadow-brutal">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-black text-white font-black text-center leading-6">!</div>
            </div>
            <div>
              <p className="font-bold text-black text-sm md:text-base">
                Connection Error: Unable to connect to payment system
                <br />
                <span className="text-xs md:text-sm font-medium">Please try refreshing the page</span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} totalSteps={6} />
          
          {/* Form Container */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step Content */}
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-full sm:w-auto px-6 py-3 border-4 border-black bg-white font-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase text-sm md:text-base"
              >
                ← Previous
              </button>
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto px-6 py-3 bg-black text-white font-black border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm md:text-base"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-4 bg-green-500 text-black font-black text-lg border-4 border-black shadow-brutal-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal transition-all disabled:opacity-60 uppercase"
                >
                  {submitting ? 'Processing...' : 'Pay ₹300 & Submit'}
                </button>
              )}
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm font-medium space-y-2">
            <p>WhatsApp: <a href="https://wa.me/918331919474" className="font-black underline">8331919474</a></p>
            <p><a href="https://cyanoindia.com" className="font-black underline">cyanoindia.com</a></p>
          </div>
        </div>
      </main>
      
      <footer className="border-t-8 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 text-xs md:text-sm font-medium text-center">
          © {new Date().getFullYear()} cyanoindia · PGS-India Natural & Organic Farming Certification support
        </div>
      </footer>
    </div>
  )
}
