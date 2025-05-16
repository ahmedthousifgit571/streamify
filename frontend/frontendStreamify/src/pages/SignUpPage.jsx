import React, { useState } from "react";
import { ShipWheelIcon, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import useSignup from "../hooks/useSignup";


const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate()
 
  const{signupMutation,isPending,error}= useSignup()   //custom hooks for signup api using tanstack query

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUpPage = (e) => {
    e.preventDefault();
    signupMutation(signupData)
    // Handle form submission logic here
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-300"
      data-theme="forest"
    >
      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/90 rounded-xl shadow-xl overflow-hidden">
        {/* Sign up form - left side */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-5 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Chatify
            </span>
          </div>

          {/* Error message if any */}
          {
            error && (
              <div className="alert alert-error mb-4">
                <span>{error.response?.data?.message}</span>
              </div>
            )
          }

          <div className="w-full">
            <form onSubmit={handleSignUpPage}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Create an account</h2>
                <p className="text-sm opacity-70">
                  Join Streamify and start your language learning adventure!
                </p>
              </div>

              {/* Full name input */}
              <div className="form-control w-full mb-4">
                <label className="label pb-1">
                  <span className="label-text">Full Name</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered bg-base-100 w-full pl-10"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="form-control w-full mb-4">
                <label className="label pb-1">
                  <span className="label-text">Email</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="input input-bordered bg-base-100 w-full pl-10"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="form-control w-full mb-4">
                <label className="label pb-1">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered bg-base-100 w-full pl-10 pr-10"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/50" />
                    ) : (
                      <Eye className="size-5 text-base-content/50" />
                    )}
                  </button>
                </div>
                <p className="text-xs opacity-70 mt-1">
                  Password must be at least six characters long
                </p>
              </div>

              {/* Agreement checkbox */}
              <div className="form-control mt-6 mb-6">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-success mt-1"
                    required
                  />
                  <span className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-success hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-success hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button
                className="btn btn-success w-full text-white"
                type="submit"
              >
               {isPending? (
                <>
                <span className="loading loading-spinner loading-xs">Loading...</span>
                </>
               ) : "Create account" }
              </button>

              {/* Already have account section */}
              <div className="text-center mt-4 mb-6">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-success hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              
            </form>
          </div>
        </div>

        {/* Right side - Circular illustration */}

        {/* Right side - Illustration */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-base-300 to-base-200 relative flex items-center justify-center py-6 sm:py-8">
          <div className="flex flex-col items-center justify-center h-full p-4 md:p-8">
            {/* Circular image container - responsive sizing */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-teal-50 flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 shadow-lg overflow-hidden">
              <img
                src="/signupImage.png"
                alt="Language connection illustration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text content */}
            <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 max-w-xs md:max-w-sm">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-success">
                Connect with language partners worldwide
              </h2>
              <p className="text-xs sm:text-sm md:text-base">
                Practice conversations, make friends, and improve your language
                skills together
              </p>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-2 sm:mt-3 md:mt-4">
                <span className="badge badge-success text-white text-xs">
                  120+ Languages
                </span>
                <span className="badge badge-success text-white text-xs">
                  Global Community
                </span>
                <span className="badge badge-success text-white text-xs">
                  Free to Join
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
