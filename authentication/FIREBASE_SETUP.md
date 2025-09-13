# Firebase Setup Instructions

## The Error You're Seeing

The error "Authentication error: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)" occurs because you need to set up your own Firebase project with valid credentials.

## Steps to Fix This Issue

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "my-auth-app")
4. Follow the setup wizard

### 2. Enable Authentication Methods

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Phone** (for OTP authentication)
   - **Email/Password** (for magic link)
   - **Google** (optional)
   - **Facebook** (optional)

### 3. Configure Phone Authentication

1. In **Authentication** > **Sign-in method** > **Phone**
2. Add your phone number for testing
3. Make sure your Firebase project has billing enabled (required for phone auth)

### 4. Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>) 
4. Register your app with a nickname
5. Copy the configuration object

### 5. Update Your Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_actual_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
REACT_APP_FIREBASE_APP_ID=your_actual_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id
```

### 6. Restart Your Development Server

After updating the `.env` file:

```bash
npm run dev
```

## Important Notes

- **Never commit your `.env` file** - it contains sensitive information
- The `.env.example` file shows the structure without real values
- Phone authentication requires a paid Firebase plan (Blaze plan)
- Make sure your domain is authorized in Firebase Console under Authentication > Settings > Authorized domains

## Troubleshooting

If you still see errors:

1. **Check Firebase Console** - Make sure authentication methods are enabled
2. **Verify billing** - Phone auth requires paid plan
3. **Check authorized domains** - Add localhost:3000 to authorized domains
4. **Clear browser cache** - Sometimes cached configs cause issues

## Security Best Practices

- Use environment variables for all Firebase config
- Enable App Check for production
- Set up proper security rules
- Monitor authentication usage in Firebase Console
