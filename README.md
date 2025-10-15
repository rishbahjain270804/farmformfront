# Farmer Form Frontend

This is the frontend application for the Farmer Form project built with React, Vite, and Tailwind CSS.

## Features

- Responsive farmer registration form
- Real-time form validation
- Payment integration with Razorpay
- Modern UI with Tailwind CSS
- Fast development with Vite

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

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (for API calls)
- **Payment Integration**: Razorpay

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.