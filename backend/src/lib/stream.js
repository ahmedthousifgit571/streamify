import {StreamChat} from 'stream-chat'
import "dotenv/config"

const apiKey = process.env.STREAM_API
const streamSecret = process.env.STREAM_SECRET

if(!apiKey || !streamSecret){
    console.error("Stream api or secret is missing")
}

const streamClient = StreamChat.getInstance(apiKey,streamSecret)

export const upsertStreamUser = async (userData) =>{
    try {
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.log("error upserting stream user",error)
    }
}


// todo : (update later)
export const generateStreamToken = async (userId)=>{

}