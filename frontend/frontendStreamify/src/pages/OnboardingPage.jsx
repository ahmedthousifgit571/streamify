import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completOnboarding } from '../lib/api'
import { CameraIcon, LoaderIcon, MapIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES } from '../constants'
import  toast ,{Toaster}  from 'react-hot-toast'

const OnboardingPage = () => {
  const {isLoading,authUser} = useAuthUser() //custom hook to know user authenticated
  const [formState,setFormState] = useState({
    fullName: authUser?.fullName||"",
    bio: authUser?.bio || "",
    nativeLanguage : authUser?.nativeLanguage || "",
    learningLanguage : authUser?.learningLanguage || "",
    location : authUser?.location || "",
    profilePic : authUser?.profilePic || ""

  })

  const queryClient = useQueryClient()

  //tanstack query for fetching from api
  const {mutate : onboardingMutation, isPending} = useMutation({
    mutationFn: completOnboarding,
    onSuccess : ()=>{
      toast.success("Profile onboarded successfully")
      queryClient.invalidateQueries({queryKey :["authUser"]})
    },
    onError: (error)=>{
      toast.error(error.response.data.message)
    }
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    onboardingMutation(formState)
  }
  const handleRandomAvatar =()=>{
     const idx = Math.floor(Math.random() * 100 ) +1
     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
     setFormState({...formState,profilePic:randomAvatar})
      toast.success("Random profile picture updated", {
       duration: 4000,
       position: 'top-right'
     })
  }

  return (
    
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete your profile</h1>
           <Toaster 
            position="top-center"
            reverseOrder={false}
           />
          <form onSubmit={handleSubmit} className='space-y-6'>
            
            {/* Profile pic container */}
            <div className='flex flex-col items-center justify-center space-y-4'>
                  {/*image preview */}
                  <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                    {
                      formState.profilePic ? (<img src={formState.profilePic} alt="Profile Preview" className='w-full h-full object-cover' />) :
                      (
                        <div className='flex items-center justify-center h-full'>
                          <CameraIcon className='size-12 text-base-content opacity-40'/>
                        </div>
                      )
                    }

                  </div>

                  {/* generate random avatar button */}
                  <div className='flex items-center gap-2'>
                    <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                      <ShuffleIcon className='size-4 mr-2'/>
                      Generate Random avatar</button> 
                  </div>

            </div>

               {/* Full name input */}
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input 
                    type="text"
                    name='fullName'
                    value={formState.fullName}
                    onChange={(e)=> setFormState({...formState,fullName:e.target.value})}
                    className='input input-bordered w-full'
                    placeholder='your full name'
                    />
                  </div>

                  {/* Bio */}
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'> Bio</span>
                    </label>
                    <textarea 
                    name="bio" 
                    value={formState.bio}
                    onChange={(e)=> setFormState({...formState,bio:e.target.value})}
                    className='textarea textarea-border h-24'
                    placeholder='Tell others about yourself and your language learning goals'
                    >
                    </textarea>
                  </div>

                  {/* Languages */}
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Native Language</span>
                      </label> 
                     <select 
                     name="nativeLanguage" 
                     value={formState.nativeLanguage}
                     onChange={(e)=>setFormState({...formState,nativeLanguage:e.target.value})}
                     className='select select-bordered w-full'
                     >
                      <option value="">Select your native language</option>
                      {
                        LANGUAGES.map((lang)=>(
                          <option key={`native-${lang}`} value={lang.toLowerCase()}> {lang}</option>
                        ))
                      }

                     </select>
                  </div>

                  {/* Learning Language */}
                   <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Learning Language</span>
                      </label> 
                     <select 
                     name="nativeLanguage" 
                     value={formState.learningLanguage}
                     onChange={(e)=>setFormState({...formState,learningLanguage:e.target.value})}
                     className='select select-bordered w-full'
                     >
                      <option value="">Select your learning language</option>
                      {
                        LANGUAGES.map((lang)=>(
                          <option key={`native-${lang}`} value={lang.toLowerCase()}> {lang}</option>
                        ))
                      }

                     </select>
                  </div>
                   {/* Location */}
                   <div className='form-control'>
                     <label className='label'>
                      <span className='label-text'>Location</span>
                     </label>
                     <div className='relative'>
                      <MapIcon className='absolute top-1/2 transform -translate-y-1/2  left-3 size-5 text-base-content opacity-70'/>
                      <input 
                      type="text"
                      name='location'
                      value={formState.location}
                      onChange={(e)=> setFormState({...formState,location:e.target.value})}
                      className='input input-bordered w-full pl-10'
                      placeholder='City, Country'
                      /> 
                     </div>
                   </div>

                   {/* Submit button */}
                   <button className='btn btn-primary w-full' disabled={isPending} type="submit">
                     {
                      !isPending ? (
                        <>
                        <ShipWheelIcon className='size-5 mr-2'/>
                        Complete Onboarding
                        </>
                      ) : (
                        <>
                        <LoaderIcon className='animate-spin size-5 mr-2'/>
                        Onboarding...
                        </>
                      )
                     }
                   </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage

