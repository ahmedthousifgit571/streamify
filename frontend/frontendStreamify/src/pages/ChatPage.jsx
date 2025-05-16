import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'
import {Channel,ChannelHeader,Chat,MessageInput,Thread,Window,MessageList} from "stream-chat-react"
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'
import ChatLoader from '../components/ChatLoader'
import CallButton from '../components/CallButton'


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
const ChatPage = () => {
  const {id : targetUserId} = useParams()

  const [chatClient,setChatClient] = useState(null)
  const [channel,setChannel] = useState(null)
  const [loading,setLoading] = useState(true)

  const {authUser} = useAuthUser()
  const {data :tokenData} = useQuery({
    queryKey:["streamToken"],
    queryFn: getStreamToken,
    enabled: !! authUser              //this line for only allowing the query when authUser is fetched
  })

  useEffect(() => {
  const initChat = async () => {
    if (!tokenData?.token || !authUser) return;

    try {
      // Create a new client instead of reusing the existing one
      const client = StreamChat.getInstance(STREAM_API_KEY);
      
      console.log("initializing stream chat client...");
      console.log("Auth user:", authUser);
      console.log("Token data:", tokenData);

      await client.connectUser({
        id: authUser._id.toString(),
        name: authUser.fullName || "User",
        image: authUser.profilePic || "",
      }, tokenData.token);
      
      const channelId = [authUser._id.toString(), targetUserId].sort().join("-");
      console.log("Channel ID:", channelId);
      
      const currChannel = client.channel("messaging", channelId, {
        members: [authUser._id.toString(), targetUserId]
      });
      
      await currChannel.watch();
      setChatClient(client);
      setChannel(currChannel);
    } catch (error) {
      console.log("Error initializing chat:", error);
      toast.error("Could not connect to chat. Please try again");
    } finally {
      setLoading(false);
    }
  };
  
  initChat();
  
  // Cleanup function to properly disconnect when component unmounts
  return () => {
    const disconnect = async () => {
      if (chatClient) {
        try {
          // Before disconnecting, clear state first
          setChatClient(null);
          setChannel(null);
          
          // Now disconnect after state is cleared
          await chatClient.disconnectUser();
          console.log("User disconnected on cleanup");
        } catch (err) {
          console.log("Error disconnecting user:", err);
        }
      }
    };
    
    disconnect();
  };
}, [tokenData, authUser, targetUserId]); // Remove chatClient from dependencies

const handleVideoCall = ()=>{
  if(channel){
    const callUrl=`${window.location.origin}/call/${channel.id}`

    channel.sendMessage({
      text:`I've started a video call. Join me here: ${callUrl}`
    })

    toast.success("Video call link sent successfully!")
  }
}
  
  if(loading || !chatClient || !channel) return <ChatLoader />

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
