# Farmer Form Frontend

This is the frontend application for the Farmer Form project built with React, Vite, and Tailwind CSS.

## Features

- **Multi-Crop Registration**: Farmers can add multiple crops with detailed information for each
- **Enhanced UI Design**: Color-coded sections with intuitive organization
- **Comprehensive Crop Details**: 
  - Crop name, type, and variety
  - Area allocation and planting dates
  - Irrigation methods and expected yields
- **Dynamic Form Fields**: Add/remove crops as needed
- **Real-time Form Validation**: Zod-based validation with helpful error messages
- **Organized Sections**:
  - 👤 Personal Information
  - 📍 Address Information
  - 🏞️ Land Information
  - 🌱 Crop Details (Multi-crop support)
  - 🚜 Farming Practice & Experience
  - 📚 Training & Support
- **Payment Integration**: Secure Razorpay payment gateway
- **Responsive Design**: Works on all devices
- **Modern UI**: Tailwind CSS with gradient effects and smooth transitions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rishbahjain270804/farmformfront.git
   cd farmformfront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=https://farmformback.onrender.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   ├── index.css        # Global styles with Tailwind
│   └── api.js           # API communication functions
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Form Management**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios (for API calls)
- **Payment Integration**: Razorpay

## Recent Updates

### Multi-Crop Feature (Latest)
- Added ability to register multiple crops per farmer
- Each crop includes: name, type, variety, area, sowing/harvest dates, irrigation method, and expected yield
- Dynamic add/remove crop functionality
- Enhanced UI with color-coded sections
- Improved form validation and error handling

For backend integration details, see `BACKEND_CHANGES_REQUIRED.md`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.