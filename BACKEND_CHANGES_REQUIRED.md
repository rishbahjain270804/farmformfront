# Backend Changes Required for Multi-Crop Feature

## Overview
The frontend has been updated to support multiple crops per farmer registration. The backend needs to be updated to handle the new data structure.

## Current Backend Schema (models.registration.js)
```javascript
// Current single crop fields
presentCrop: String,
sowingDate: String,
harvestingDate: String,
cropTypes: String,
```

## Recommended Backend Schema Changes

### Option 1: Add Crops Array (Recommended)
Update the `RegistrationSchema` in `src/models.registration.js` to include a crops array:

```javascript
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
  
  // NEW: Array of crops
  crops: [CropSchema],
  
  // DEPRECATED (keep for backwards compatibility during migration)
  // presentCrop: String,
  // sowingDate: String,
  // harvestingDate: String,
  // cropTypes: String,
  
  currentPractice: String,
  yearsExperience: String,
  irrigationSource: String,
  livestock: [String],
  willingNaturalInputs: String,
  trainingRequired: String,
  localGroup: String,
  preferredSeason: String,
  remarks: String,

  // Payment/order
  orderId: String,
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  paymentId: String,
  signature: String,
  paidAt: Date,
}, { timestamps: true })
```

### Option 2: Keep Old Fields for Backwards Compatibility
If you want to maintain backwards compatibility with existing data:

```javascript
const RegistrationSchema = new mongoose.Schema({
  // ... other fields ...
  
  // New multi-crop support
  crops: [CropSchema],
  
  // Old fields (deprecated but kept for backwards compatibility)
  presentCrop: String,
  sowingDate: String,
  harvestingDate: String,
  cropTypes: String,
  
  // ... rest of fields ...
})
```

## Frontend Data Format
The frontend now sends data in this format:

```javascript
{
  email: "farmer@example.com",
  farmerName: "John Doe",
  // ... other fields ...
  
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
  ],
  
  // ... other fields ...
}
```

## Migration Strategy

### For New Installations
Simply use Option 1 above with the crops array.

### For Existing Installations with Data
1. Keep both old and new fields temporarily
2. Create a migration script to convert old single-crop data to the new array format:

```javascript
// migration.js
async function migrateCropData() {
  const registrations = await Registration.find({
    $and: [
      { crops: { $exists: false } },
      { $or: [
        { presentCrop: { $exists: true, $ne: null } },
        { sowingDate: { $exists: true, $ne: null } }
      ]}
    ]
  })
  
  for (const reg of registrations) {
    if (reg.presentCrop || reg.cropTypes) {
      reg.crops = [{
        cropName: reg.presentCrop || reg.cropTypes || 'Unknown',
        cropType: reg.cropTypes || 'Other',
        sowingDate: reg.sowingDate,
        expectedHarvestDate: reg.harvestingDate,
        areaAllocated: reg.areaUnderNaturalHa || 'Not specified'
      }]
      await reg.save()
    }
  }
  
  console.log(`Migrated ${registrations.length} records`)
}
```

3. After migration is complete, you can optionally remove the old fields

## API Changes Required

### No changes needed in `/api/create-order`
The endpoint should automatically accept the new `crops` array field as it spreads the form data:
```javascript
const registration = await Registration.create({
  ...form,  // This will include the crops array
  paymentStatus: 'pending',
})
```

### No changes needed in `/api/verify-payment`
Payment verification logic remains the same.

## Testing Recommendations

1. Test with single crop entry
2. Test with multiple crop entries (2-5 crops)
3. Test validation for required crop fields
4. Test backwards compatibility if keeping old fields
5. Test payment flow with new data structure

## Benefits of New Structure

1. **Flexibility**: Farmers can register multiple crops accurately
2. **Better Data**: More detailed information per crop (variety, irrigation method, expected yield)
3. **Analytics**: Better reporting and analysis capabilities
4. **Scalability**: Can easily add more crop-specific fields in the future

## Deployment Notes

1. Update backend schema first
2. Test with sample data
3. Deploy backend changes
4. Deploy frontend changes
5. Monitor for any issues

## Support

For any questions or issues, please contact the development team.
