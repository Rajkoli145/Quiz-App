import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase.config';

const FirebaseOtpAuth = () => {
  const [activeTab, setActiveTab] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  
  const recaptchaRef = useRef(null);
  const recaptchaVerifier = useRef(null);

  useEffect(() => {
    // Check if user is returning from email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      handleEmailLinkSignIn();
    }

    return () => {
      if (recaptchaVerifier.current) {
        try {
          recaptchaVerifier.current.clear();
          recaptchaVerifier.current = null;
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
      }
    };
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handlePhoneAuth = async () => {
    if (!phoneNumber || phoneNumber === '+91') {
      showMessage('Please enter a valid phone number', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting phone authentication with:', phoneNumber);
      
      // Initialize reCAPTCHA verifier on demand
      if (!recaptchaVerifier.current) {
        console.log('Initializing reCAPTCHA verifier...');
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: (response) => {
            console.log('reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            showMessage('reCAPTCHA expired. Please try again.', 'error');
          },
          'error-callback': (error) => {
            console.error('reCAPTCHA error:', error);
            showMessage('reCAPTCHA error. Please refresh and try again.', 'error');
          }
        });
        
        // Render the reCAPTCHA
        await recaptchaVerifier.current.render();
        console.log('reCAPTCHA verifier initialized and rendered successfully');
      }

      console.log('reCAPTCHA verifier:', recaptchaVerifier.current);
      
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      showMessage('OTP sent successfully!', 'success');
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Phone auth error details:', {
        code: error.code,
        message: error.message,
        customData: error.customData,
        stack: error.stack
      });
      
      // Clear the reCAPTCHA verifier on error to allow retry
      if (recaptchaVerifier.current) {
        try {
          recaptchaVerifier.current.clear();
          recaptchaVerifier.current = null;
        } catch (clearError) {
          console.error('Error clearing reCAPTCHA:', clearError);
        }
      }
      
      let errorMessage = 'Failed to send OTP';
      if (error.code === 'auth/internal-error') {
        errorMessage = 'Firebase internal error. This usually means: 1) Phone authentication may not be properly configured in Firebase Console, 2) Check if your Firebase project has billing enabled (required for phone auth), 3) Verify your domain is authorized';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please use format: +91XXXXXXXXXX';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later or enable billing in Firebase Console';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || !confirmationResult) {
      showMessage('Please enter the OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      showMessage('Phone number verified successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showMessage('Invalid OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const actionCodeSettings = {
        url: 'http://192.168.29.224:3000',
        handleCodeInApp: true,
      };

      console.log('Sending email link to:', email);
      console.log('Action code settings:', actionCodeSettings);

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      setEmailLinkSent(true);
      showMessage('Magic link sent to your email! Check your inbox and spam folder.', 'success');
      console.log('Email link sent successfully');
    } catch (error) {
      console.error('Email auth error details:', {
        code: error.code,
        message: error.message,
        customData: error.customData
      });
      
      let errorMessage = 'Failed to send magic link';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLinkSignIn = async () => {
    let emailForSignIn = localStorage.getItem('emailForSignIn');
    if (!emailForSignIn) {
      emailForSignIn = window.prompt('Please provide your email for confirmation');
    }

    try {
      const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
      localStorage.removeItem('emailForSignIn');
      showMessage('Email verified successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } catch (error) {
      console.error('Error signing in with email link:', error);
      showMessage(error.message || 'Failed to verify email link', 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      showMessage('Google sign-in successful!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      showMessage(error.message || 'Google sign-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      showMessage('Facebook sign-in successful!', 'success');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } catch (error) {
      console.error('Error with Facebook sign-in:', error);
      showMessage(error.message || 'Facebook sign-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneAuth = () => {
    setOtpSent(false);
    setOtp('');
    setConfirmationResult(null);
    setPhoneNumber('+91');
  };

  const resetEmailAuth = () => {
    setEmailLinkSent(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent text-3xl font-bold">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">Sign in to continue to your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl p-8">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-green-200 text-green-600 border-green-300' 
                : message.type === 'warning'
                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex mb-8 bg-gray-100/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'phone'
                  ? 'bg-white shadow-md text-blue-600 transform scale-105'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📱 Phone OTP
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'email'
                  ? 'bg-white shadow-md text-blue-600 transform scale-105'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✉️ Magic Link
            </button>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-500 ease-in-out">
            {activeTab === 'phone' && (
              <div className="space-y-6">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="block text-gray-600 font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-xl placeholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={handlePhoneAuth}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-gray-600 font-medium mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-xl placeholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        maxLength="6"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={verifyOtp}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button
                        onClick={resetPhoneAuth}
                        className="px-4 py-3 bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 text-gray-700 font-medium rounded-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Reset
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                {!emailLinkSent ? (
                  <>
                    <div>
                      <label className="block text-gray-600 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-xl placeholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <button
                      onClick={handleEmailAuth}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending Link...' : 'Send Magic Link'}
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">📧</div>
                    <h3 className="text-xl font-semibold text-gray-800">Check Your Email</h3>
                    <p className="text-gray-600">
                      We've sent a magic link to <strong>{email}</strong>
                    </p>
                    <button
                      onClick={resetEmailAuth}
                      className="bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 text-gray-700 font-medium py-2 px-6 rounded-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Try Different Email
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 font-medium">or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white/50 backdrop-blur-sm border border-gray-300 hover:bg-red-50/50 hover:border-red-300 text-gray-700 font-medium py-3 px-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={handleFacebookSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white/50 backdrop-blur-sm border border-gray-300 hover:bg-blue-50/50 hover:border-blue-300 text-gray-700 font-medium py-3 px-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* reCAPTCHA Container */}
          <div id="recaptcha-container"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseOtpAuth;
