import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, MessageSquare, Chrome, Facebook } from 'lucide-react';
import { 
  initializeApp 
} from 'firebase/app';
import { 
  getAuth, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signInWithEmailLink, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';

import { cn } from "../../lib/utils";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvQJKoxVaEQN8mQNwBmOL_wVzy-VMx6Vo",
  authDomain: "auth-17a2e.firebaseapp.com",
  projectId: "auth-17a2e",
  storageBucket: "auth-17a2e.firebasestorage.app",
  messagingSenderId: "1002047583921",
  appId: "1:1002047583921:web:e5e1c9e4f0f1c9e4f1c9e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export function FirebaseSignInCard() {
  const [activeTab, setActiveTab] = useState('email');
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const recaptchaRef = useRef(null);
  const recaptchaVerifier = useRef(null);

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
    }

    // Check if user is returning from email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      handleEmailLinkSignIn();
    }

    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber === '+91') {
      showMessage('Please enter a valid phone number', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to send OTP to:', phoneNumber);
      
      if (!recaptchaVerifier.current) {
        console.log('Initializing reCAPTCHA verifier...');
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved, response:', response);
          }
        });
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
      console.log('OTP sent successfully, confirmation:', confirmation);
      
      setConfirmationResult(confirmation);
      setOtpSent(true);
      showMessage('OTP sent successfully!', 'success');
    } catch (error) {
      console.error('Error sending OTP:', error);
      handleFirebaseError(error);
      
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) {
      showMessage('Please enter the OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying OTP:', otp);
      const result = await confirmationResult.confirm(otp);
      console.log('Phone authentication successful:', result);
      
      showMessage('Phone authentication successful!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordAuth = async () => {
    if (!email || !password) {
      showMessage('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        console.log('Creating new account with email:', email);
        result = await createUserWithEmailAndPassword(auth, email, password);
        showMessage('Account created successfully!', 'success');
      } else {
        console.log('Signing in with email:', email);
        result = await signInWithEmailAndPassword(auth, email, password);
        showMessage('Sign in successful!', 'success');
      }
      
      console.log('Email authentication successful:', result);
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('Error with email authentication:', error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailLink = async () => {
    if (!email) {
      showMessage('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending email link to:', email);
      
      const actionCodeSettings = {
        url: 'http://192.168.29.224:3000',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      console.log('Email link sent successfully');
      
      localStorage.setItem('emailForSignIn', email);
      setEmailLinkSent(true);
      showMessage('Check your email for the sign-in link!', 'success');
    } catch (error) {
      console.error('Error sending email link:', error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLinkSignIn = async () => {
    try {
      let emailForSignIn = localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }

      const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
      console.log('Email link authentication successful:', result);
      
      localStorage.removeItem('emailForSignIn');
      showMessage('Email authentication successful!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('Error with email link sign-in:', error);
      handleFirebaseError(error);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('Attempting Google sign-in...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google authentication successful:', result);
      
      showMessage('Google authentication successful!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      console.log('Attempting Facebook sign-in...');
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Facebook authentication successful:', result);
      
      showMessage('Facebook authentication successful!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('Error with Facebook sign-in:', error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseError = (error) => {
    console.error('Firebase Error Details:', {
      code: error.code,
      message: error.message,
      customData: error.customData,
      stack: error.stack
    });

    switch (error.code) {
      case 'auth/invalid-phone-number':
        showMessage('Invalid phone number format. Please check and try again.', 'error');
        break;
      case 'auth/too-many-requests':
        showMessage('Too many attempts. Please try again later.', 'error');
        break;
      case 'auth/invalid-verification-code':
        showMessage('Invalid OTP. Please check and try again.', 'error');
        break;
      case 'auth/code-expired':
        showMessage('OTP has expired. Please request a new one.', 'error');
        break;
      case 'auth/invalid-email':
        showMessage('Invalid email address. Please check and try again.', 'error');
        break;
      case 'auth/user-disabled':
        showMessage('This account has been disabled.', 'error');
        break;
      case 'auth/operation-not-allowed':
        showMessage('This sign-in method is not enabled. Please contact support.', 'error');
        break;
      case 'auth/internal-error':
        showMessage('Internal error occurred. Please check Firebase configuration and billing.', 'error');
        break;
      case 'auth/billing-not-enabled':
        showMessage('Phone authentication requires Firebase Blaze plan. Please upgrade or use test numbers.', 'error');
        break;
      default:
        showMessage(`Authentication error: ${error.message}`, 'error');
    }
  };

  const resetPhoneAuth = () => {
    setPhoneNumber('+91');
    setOtp('');
    setOtpSent(false);
    setConfirmationResult(null);
    setMessage({ text: '', type: '' });
    
    if (recaptchaVerifier.current) {
      recaptchaVerifier.current.clear();
      recaptchaVerifier.current = null;
    }
  };

  const resetEmailAuth = () => {
    setEmail('');
    setEmailLinkSent(false);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-25 animate-pulse"></div>
          
          {/* Main card */}
          <div className="relative bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-10 shadow-xl min-h-[700px]">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1 
                className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent text-3xl font-bold mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Sign in to continue to your account
              </motion.p>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('email')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === 'email'
                    ? "bg-white shadow-lg text-gray-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                )}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setActiveTab('phone')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === 'phone'
                    ? "bg-white shadow-lg text-gray-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                )}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </button>
              <button
                onClick={() => setActiveTab('magic-link')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === 'magic-link'
                    ? "bg-white shadow-lg text-gray-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                )}
              >
                <ArrowRight className="w-4 h-4 inline mr-2" />
                Magic Link
              </button>
            </div>

            {/* Message Display */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "mb-6 p-4 rounded-xl border transition-all duration-300",
                    message.type === 'success' 
                      ? "bg-green-200 text-green-600 border-green-300"
                      : message.type === 'warning'
                      ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  )}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email/Password Authentication Tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-gray-600 font-medium">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="pl-10 bg-white/30 backdrop-blur-sm border-gray-300 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onFocus={() => setFocusedInput('email')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-gray-600 font-medium">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white/30 backdrop-blur-sm border-gray-300 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onFocus={() => setFocusedInput('password')}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleEmailPasswordAuth}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  <div className="text-center">
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Phone Authentication Tab */}
              {activeTab === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {!otpSent ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-gray-600 font-medium">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <Input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="pl-10 bg-white/30 backdrop-blur-sm border-gray-300 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onFocus={() => setFocusedInput('phone')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </div>
                      </div>
                      <motion.button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Send OTP
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-gray-600 font-medium">Enter OTP</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <Input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            className="pl-10 bg-white/30 backdrop-blur-sm border-gray-300 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={6}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={handleVerifyOtp}
                          disabled={loading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            'Verify OTP'
                          )}
                        </motion.button>
                        <motion.button
                          onClick={resetPhoneAuth}
                          className="px-4 py-3 bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 text-gray-700 font-medium rounded-xl transform hover:scale-105 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Reset
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Magic Link Authentication Tab */}
              {activeTab === 'magic-link' && (
                <motion.div
                  key="magic-link"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {!emailLinkSent ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-gray-600 font-medium">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="pl-10 bg-white/30 backdrop-blur-sm border-gray-300 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                          />
                        </div>
                      </div>
                      <motion.button
                        onClick={handleSendEmailLink}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Send Magic Link
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-gray-600">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                        <p>Check your email for the magic link!</p>
                        <p className="text-sm text-gray-500 mt-2">Click the link in your email to sign in.</p>
                      </div>
                      <motion.button
                        onClick={resetEmailAuth}
                        className="px-6 py-2 bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 text-gray-700 font-medium rounded-xl transform hover:scale-105 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Try Different Email
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <motion.button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </motion.button>
              
              <motion.button
                onClick={handleFacebookSignIn}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg border border-blue-600 transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Facebook className="w-5 h-5 mr-3" />
                Continue with Facebook
              </motion.button>
            </div>

            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
