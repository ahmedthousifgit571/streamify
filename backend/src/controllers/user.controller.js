import FriendRequest from "../models/FriendRequest.js"
import User from "../models/Users.js"


export const getRecommendedUser = async (req,res)=>{
  try {
    const currentUserId = req.user._id
    const currentUser = req.user
 
    const recommendedUser = await User.find({
     $and : [
         {_id:{$ne:currentUserId} },
         {$id : {$nin: currentUser.friends}},
         {isOnboarded : true}
     ]
    })
 
    res.status(200).json({recommendedUser})
  } catch (error) {
    console.log('error in getRecommended controller',error);
    res.status(500).json({message:"internal server error"})
    
  }
}



export const getMyFriends = async(req,res) =>{
   try {
      const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends","fullName profilePic nativeLanguage learningLanguage")

      res.status(200).json(user.friends)
   } catch (error) {
     console.log('error in getMyFriends controller',error)
     res.status(500).json({
        statusCode:500,
        message:"internal server error"
     })
   }
}


export const sendFriendRequest = async(req,res)=>{
    const myId = req.user.id
    const {id: recipientId} = req.params

    if(myId === recipientId){
        return res.status(400).json({
            message:"you can't send request to yourself"
        })
    }

    const recipient = await User.findById(recipientId)
    if(!recipient){
        return res.status(404).json({
            message:"recipient not found"
        })
    }

    //check if user is already a friends
    if(recipient.friends.includes(myId)){
        return res.status(400).json({
            message:"you are already friend with this user"
        })
    }

    //check if req alreay exists
    const existingRequest = await FriendRequest.findOne({
        $or:[
            {sender:myId,recipient:recipientId},
            {sender:recipientId, recipient:myId}
        ]
    })
    if(existingRequest){
        return res.status(400).json({
            message:"A friend request already exists with you and this friend"
        })
    }

    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient:recipientId
    })

    res.status(201).json(friendRequest)
}

export const acceptFriendRequest = async(req,res)=>{
 try {
    const {id:requestId} = req.params
    const friendRequest = await FriendRequest.findById(requestId)

    if(!friendRequest){
        return res.status(404).json({
            message:"friend request not found"
        })
    }
    
    //verify the current user is the recipient
    if(friendRequest.recipient.toString() !== req.user.id){
        return res.status(401).json({
            message:"you are not authorized to accept this request"
        })
    }

    friendRequest.status = "accepted"
    await friendRequest.save()

     //add each users to other friends array
     await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet:{ friends: friendRequest.recipient}
     })

     await User.findByIdAndUpdate(friendRequest.recipient,{
        $addToSet: {friends: friendRequest.sender}
     })

     return res.status(200).json({
        message:"friend request accepted successfully"
     })
     
 } catch (error) {
    console.log('error in accept controller',error)
    return res.status(500).json({
        message:"internal server error"
    })
 }   
}