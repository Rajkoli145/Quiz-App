# Firebase OTP Authentication Component

A beautiful, production-ready React authentication component with Firebase integration featuring Phone OTP, Email Magic Link, and Social Login capabilities.

## ✨ Features

- **Dual Authentication Methods**
  - 📱 Phone OTP with invisible reCAPTCHA
  - ✉️ Email Magic Link authentication
  
- **Social Login Integration**
  - 🔍 Google Sign-in
  - 📘 Facebook Sign-in
  
- **Modern Design**
  - Glassmorphic UI with backdrop blur effects
  - Soft pastel color palette
  - Smooth animations and hover effects
  - Fully responsive design
  
- **User Experience**
  - Tab-based interface with smooth transitions
  - Real-time error handling and success messages
  - Loading states and disabled button states
  - Auto-redirect to `/home` after successful authentication

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication and configure sign-in methods:
   - **Phone**: Enable Phone authentication
   - **Email Link**: Enable Email/Password and Email Link sign-in
   - **Google**: Enable Google sign-in
   - **Facebook**: Enable Facebook sign-in

4. Get your Firebase config from Project Settings > General > Your apps
5. Replace the placeholder config in `FirebaseOtpAuth.jsx`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Configure Authentication Methods

#### Phone Authentication
- In Firebase Console > Authentication > Sign-in method
- Enable Phone authentication
- Add your domain to authorized domains

#### Email Link Authentication
- Enable Email/Password sign-in method
- Enable Email link (passwordless sign-in)

#### Social Providers
- **Google**: Enable Google sign-in and configure OAuth consent screen
- **Facebook**: Enable Facebook sign-in and add your Facebook App ID and secret

### 4. Setup Tailwind CSS

Create `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Run the Application

```bash
npm start
```

## 🎨 Design System

### Color Palette
- **Background**: `bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`
- **Card**: `bg-white/80 backdrop-blur-md border-gray-200/50`
- **Primary Buttons**: `bg-blue-600 hover:bg-blue-700`
- **Alternative Buttons**: `bg-gradient-to-r from-blue-200 to-purple-200`
- **Success Messages**: `bg-green-200 text-green-600 border-green-300`
- **Error Messages**: `bg-red-50 text-red-600 border-red-200`

### Typography
- **Headings**: `text-gray-800`
- **Labels**: `text-gray-600`
- **Input Text**: `text-gray-700`
- **Placeholders**: `placeholder:text-gray-500`

## 📱 Usage Example

```jsx
import React from 'react';
import FirebaseOtpAuth from './FirebaseOtpAuth';

function App() {
  return (
    <div className="App">
      <FirebaseOtpAuth />
    </div>
  );
}

export default App;
```

## 🔧 Configuration Options

### Phone Number Format
The component accepts international phone numbers. Examples:
- `+1 (555) 123-4567` (US)
- `+44 20 7946 0958` (UK)
- `+91 98765 43210` (India)

### Email Link Configuration
The email link will redirect users back to the current page. Make sure to add your domain to Firebase authorized domains.

### reCAPTCHA
The component uses invisible reCAPTCHA for phone authentication. No additional setup required.

## 🚨 Important Security Notes

1. **Never commit your actual Firebase config** to version control
2. **Configure Firebase Security Rules** for your database
3. **Set up proper CORS policies** for your domain
4. **Enable App Check** for additional security in production
5. **Configure authorized domains** in Firebase Console

## 🎯 Production Checklist

- [ ] Replace placeholder Firebase config with actual values
- [ ] Configure all required authentication methods in Firebase Console
- [ ] Add your domain to Firebase authorized domains
- [ ] Set up proper Firebase Security Rules
- [ ] Enable Firebase App Check
- [ ] Test all authentication flows
- [ ] Configure proper error handling for production
- [ ] Set up analytics and monitoring

## 🛠️ Customization

### Styling
The component uses Tailwind CSS classes. You can customize:
- Colors by modifying the gradient and color classes
- Animations by adjusting transition durations
- Layout by changing spacing and sizing classes

### Functionality
- Modify redirect URL after successful authentication
- Add additional validation for phone numbers and emails
- Customize error messages
- Add loading spinners or progress indicators

## 📄 License

MIT License - feel free to use this component in your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
