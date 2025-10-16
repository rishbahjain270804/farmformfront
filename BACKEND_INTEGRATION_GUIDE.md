# Backend Integration Guide

## ✅ Backend Status: READY

The backend repository (https://github.com/Rexjain270804/farmformback) has been reviewed and **already supports all required features** for the multi-crop farmer registration form.

## Current Backend Schema

The backend already has the correct schema implemented in `src/models.registration.js`:

```javascript
// Crop sub-schema for individual crop entries
const CropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  cropType: { type: String, required: true },
  variety: String,
  areaAllocated: { type: String, required: true },
  sowingDate: { type: String, required: true },
  expectedHarvestDate: String,
  irrigationMethod: String,
  expectedYield: String,
}, { _id: false })

const RegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  registrationDate: String,
  farmerName: { type: String, required: true },
  fatherSpouseName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  altEmail: String,
  village: String,
  mandal: String,
  district: String,
  state: String,
  aadhaarOrFarmerId: String,
  totalLand: String,
  areaUnderNaturalHa: String,
  crops: [CropSchema],  // ✅ Already supports multiple crops
  currentPractice: String,
  yearsExperience: String,
  irrigationSource: String,
  livestock: [String],
  willingNaturalInputs: String,
  trainingRequired: String,
  localGroup: String,
  preferredSeason: String,
  remarks: String,
  orderId: String,
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  paymentId: String,
  signature: String,
  paidAt: Date,
}, { timestamps: true })
```

## Backend API Endpoints

### 1. Health Check
- **Endpoint**: `GET /health`
- **Purpose**: Verify backend is running
- **Response**: `{ ok: true }`

### 2. Connection Test
- **Endpoint**: `GET /api/test`
- **Purpose**: Test API connectivity and configuration
- **Response**: Status and configuration info

### 3. Create Order
- **Endpoint**: `POST /api/create-order`
- **Purpose**: Create a new farmer registration and Razorpay order
- **Request Body**: Complete form data (see Frontend Data Format below)
- **Response**: `{ order: {...}, registrationId: "..." }`

### 4. Verify Payment
- **Endpoint**: `POST /api/verify-payment`
- **Purpose**: Verify Razorpay payment signature and update registration status
- **Request Body**:
```json
{
  "registrationId": "...",
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}
```
- **Response**: `{ ok: true }`

## Recommended Backend Schema Changes (Historical Reference)

## Recommended Backend Schema Changes (Historical Reference)

**Note**: The backend schema has already been updated. This section is for reference only.

The old schema had single crop fields:
```javascript
presentCrop: String,
sowingDate: String,
harvestingDate: String,
cropTypes: String,
```

These have been replaced with the `crops` array (see Current Backend Schema above).

## Frontend Data Format

The frontend sends data in this format:

```javascript
{
  // Personal Information
  email: "farmer@example.com",
  registrationDate: "2025-10-16",
  farmerName: "Ramesh Kumar",
  fatherSpouseName: "Suresh Kumar",
  contactNumber: "9876543210",
  altEmail: "",  // Optional
  
  // Address Information
  village: "Rampur",
  mandal: "Kothagudem",
  district: "Khammam",
  state: "Telangana",
  aadhaarOrFarmerId: "1234-5678-9012",  // Optional
  
  // Land Information
  totalLand: "5 Acres",
  areaUnderNaturalHa: "2 Ha",
  
  // Crop Details (Multiple Crops Supported)
  crops: [
    {
      cropName: "Rice",
      cropType: "Cereal (Rice, Wheat, Maize, etc.)",
      variety: "Basmati",
      areaAllocated: "2 Acres",
      sowingDate: "2025-06-15",
      expectedHarvestDate: "2025-10-15",
      irrigationMethod: "Flood",
      expectedYield: "30 quintals/acre"
    },
    {
      cropName: "Wheat",
      cropType: "Cereal (Rice, Wheat, Maize, etc.)",
      variety: "PBW-343",
      areaAllocated: "1.5 Acres",
      sowingDate: "2025-11-01",
      expectedHarvestDate: "2026-04-15",
      irrigationMethod: "Sprinkler",
      expectedYield: "25 quintals/acre"
    }
    // ... more crops can be added
  ],
  
  // Farming Practice & Experience
  currentPractice: "Organic",  // Natural | Organic | Conventional | Chemical
  yearsExperience: "10",
  irrigationSource: "Borewell",  // Borewell | Canal | Rainfed
  livestock: ["COW", "BUFFALO"],  // Array of livestock types
  
  // Training & Support
  willingNaturalInputs: "Yes",  // Yes | No
  trainingRequired: "Yes",  // Yes | No
  localGroup: "Self Help Group Name",  // Optional
  preferredSeason: "Kharif",  // Kharif | Rabi | Both (Optional)
  remarks: "Looking forward to certification",  // Optional
  
  // Payment Agreement
  agreeFee: true  // Must be true to proceed
}
```

## CORS Configuration

⚠️ **Important**: The backend is configured for production deployment with CORS restricted to:
- `https://farmformfront.vercel.app`

For local development testing, you may need to:
1. Add `http://localhost:5173` to the `allowedOrigins` array in `src/server.js`
2. Or temporarily disable CORS restrictions for development

**Production CORS config (in backend `src/server.js`)**:
```javascript
const allowedOrigins = [
  'https://farmformfront.vercel.app',
  'https://farmformfront.vercel.app/',
  'farmformfront.vercel.app'
]
```

## Environment Variables

The backend requires these environment variables (in `.env` file):

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Server Port (optional, defaults to 8080)
PORT=8080
```

**⚠️ Security Note**: Never commit the `.env` file or expose API secrets in the frontend!

## Payment Flow

1. **User fills form** → Frontend validates all fields
2. **User clicks "Pay ₹300 & Submit"** → Frontend calls `/api/create-order`
3. **Backend creates registration** → Status: `pending`, saves all form data
4. **Backend creates Razorpay order** → Returns order details
5. **Frontend opens Razorpay checkout** → User completes payment
6. **Payment successful** → Razorpay calls handler with payment details
7. **Frontend calls `/api/verify-payment`** → Backend verifies signature
8. **Backend updates registration** → Status: `paid`, saves payment details
9. **Success message shown** → User registration complete

## Testing the Backend

### 1. Test Backend Connectivity
```bash
curl https://farmformback.onrender.com/health
# Expected: { "ok": true }
```

### 2. Test API Endpoint
```bash
curl https://farmformback.onrender.com/api/test
# Expected: JSON with configuration info
```

### 3. Test Create Order (with sample data)
```bash
curl -X POST https://farmformback.onrender.com/api/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "farmerName": "Test Farmer",
    "contactNumber": "1234567890",
    "crops": [{"cropName": "Rice", "cropType": "Cereal", "areaAllocated": "2 Acres", "sowingDate": "2025-06-15"}]
  }'
```

## Data Validation

The backend relies on Mongoose schema validation:
- **Required fields**: email, farmerName, fatherSpouseName, contactNumber
- **Crops array**: Must have at least one crop with required fields (cropName, cropType, areaAllocated, sowingDate)
- **Payment status**: Defaults to 'pending', enum: ['pending', 'paid', 'failed']

## Database Queries

Common queries you might need:

```javascript
// Get all pending registrations
Registration.find({ paymentStatus: 'pending' })

// Get all paid registrations
Registration.find({ paymentStatus: 'paid' })

// Get registrations by farmer name
Registration.find({ farmerName: /ramesh/i })

// Get registrations with specific crop
Registration.find({ 'crops.cropName': 'Rice' })

// Get registrations by state
Registration.find({ state: 'Telangana' })
```

## Deployment Checklist

- [x] MongoDB database is set up and accessible
- [x] Environment variables are configured in deployment platform
- [x] CORS is configured for production domain
- [x] Razorpay account is set up with live keys
- [x] Backend is deployed and accessible
- [x] Health check endpoint returns success
- [x] Schema supports multi-crop feature

## Troubleshooting

### Issue: CORS Error
**Solution**: Ensure your frontend domain is added to `allowedOrigins` in `src/server.js`

### Issue: Payment Verification Fails
**Solution**: 
- Check that `RAZORPAY_KEY_SECRET` is correctly set in backend `.env`
- Verify signature calculation matches Razorpay's documentation

### Issue: MongoDB Connection Error
**Solution**: 
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas allows connections from backend IP
- Ensure database user has correct permissions

### Issue: Backend Times Out
**Solution**: 
- Render.com free tier may spin down after inactivity
- First request after inactivity may take 30-60 seconds
- Consider upgrading to paid tier for always-on service

## Next Steps

1. ✅ **Backend is ready** - No changes needed
2. ✅ **Frontend is updated** - Form validation fixed
3. 🔄 **Deploy frontend** - Push changes to production
4. 🔄 **Test end-to-end** - Complete a test registration with payment
5. 🔄 **Monitor** - Check logs and database for successful registrations

## Support

For questions or issues:
- WhatsApp: 8331919474
- Website: https://cyanoindia.com
- Backend Repo: https://github.com/Rexjain270804/farmformback
- Frontend Repo: https://github.com/rishbahjain270804/farmformfront
