'use client';
import React, { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const router = useRouter();

 
    // Initialize reCAPTCHA verifier
  
  

  

  const handleSendOtp = async () => {
      try {
      const  recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {});
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
        setConfirmationResult(confirmation);
        setOtpSent(true);
        setPhoneNumber('');


        alert('OTP has been sent');
      } catch (error) {
        handleError(error);
      }
    }

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOTPSubmit = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert('OTP verified');
      setOtp('');
      router.push('/user#chat')
    } catch (error) {
      handleError(error);
    }
  };

  // const validatePhoneNumber = () => {
  //   const newErrors = {};
  //   if (!phoneNumber) {
  //     newErrors.phoneNumber = 'Phone number is required';
  //   } else if (!/^\d{13}$/.test(phoneNumber)) {
  //     newErrors.phoneNumber = 'Phone number must be 10 digits';
  //   }
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleError = (error) => {
    let errorMessage;
    switch (error.code) {
      case 'auth/too-many-requests':
        errorMessage = 'You have sent too many requests. Please try again later.';
        break;
      case 'auth/invalid-phone-number':
        errorMessage = 'The phone number is invalid.';
        break;
      case 'auth/missing-phone-number':
        errorMessage = 'Phone number is required.';
        break;
      default:
        errorMessage = 'An error occurred. Please try again.';
    }
    alert(errorMessage);
    console.error('Error:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(12,19,23)] p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Signup</h2>

        {!otpSent && <div id="recaptcha-container"></div>}
          <div className="mb-6">
         {!otpSent && <label htmlFor="phoneNumber" className="block text-sm mb-2">
            Phone Number
          </label>}
         {!otpSent &&  <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onKeyDown={(e) => {
              if (e.key === 'Enter' ) {
                handleSendOtp();
              }
            }}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`w-full p-2 text-gray-900 rounded focus:outline-none focus:ring-2 ${
              phoneNumber.length === 13 ? 'focus:ring-teal-500' : 'border-red-500 border-2'
            }`}
            maxLength={13} // Limit to 10 digits
          />}
          {/* {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )} */}
          {otpSent && (
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOTPChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' ) {
                  handleOTPSubmit();
                }
              }}
              className={`w-full p-2 text-gray-900 rounded focus:outline-none focus:ring-2 ${
                otp.length === 6 ? 'focus:ring-teal-500' : 'border-red-500 border-2'
              }`}
              maxLength={6} // Limit to 6 digits
            />
          )}
        </div>

        <button
          onClick={otpSent ? handleOTPSubmit : handleSendOtp}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {otpSent ? 'Submit OTP' : 'Send OTP'}
        </button>
      </div>
    </div>
  );
}
