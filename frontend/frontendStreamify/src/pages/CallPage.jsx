import React, { useEffect, useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'
import PageLoader from '../components/PageLoader'
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
const CallPage = () => {
  const {id:callId} = useParams()
  
  const [client,setClient] = useState(null)
  const [call,setCall] = useState(null)
  const [isConnecting,setIsConnecting] = useState(true)
  const [connectionError, setConnectionError] = useState(null)

  const {authUser,isLoading} = useAuthUser()

  const {data:tokenData} = useQuery({
    queryKey:["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })

  useEffect(()=>{
      const initCall =async ()=>{
        if(!tokenData.token || !authUser || !callId) return

        try {
          console.log("initializing Stream Video client...");
          const user = {
            id: authUser._id ,
            name : authUser.fullName ,
            image : authUser.profilePic 
          }

          const videoClient = new StreamVideoClient({
            apiKey: STREAM_API_KEY,
            user,
            token : tokenData.token
          })
          const callInstance = videoClient.call("default",callId)

            // Set up error handling before joining
        callInstance.on('error', (error) => {
          console.error("Call error:", error);
          setConnectionError("Failed to establish call connection");
          toast.error("Connection error: " + error.message);
        });

          await callInstance.join({create:true})
          console.log("Joined call successfully");

          setClient(videoClient)
          setCall(callInstance)
          
          
        } catch (error) {
          console.log("error joining call",error)
          setConnectionError("Failed to establish call connection");
          toast.error("could not join the call,please try again.")
        }finally {
          setIsConnecting(false)
        }
      }

      if (tokenData && authUser && callId) {
      initCall()
      }
  },[tokenData,authUser,callId])


  if(isLoading  || isConnecting) return <PageLoader />
  return (
    <div className='h-screen flex flex-col items-center justify-center'>

      <div className='relative'>
        {
          client && call ? (
            <StreamVideo client={client}>
               <StreamCall call={call}>
                  <CallContent />
               </StreamCall>
            </StreamVideo>
          ) : (
            <div className='flex items-center justify-center h-full'>
            <p>not initialize call. Please refresh or try again later</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks()
  const callState = useCallCallingState()
  const navigate = useNavigate()
  
  useEffect(() => {
    if(callState === CallingState.LEFT) {
      navigate("/")
    }
  }, [callState, navigate])

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}

export default CallPage
