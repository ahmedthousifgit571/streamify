import { upsertStreamUser } from '../lib/stream.js'
import User from '../models/Users.js'
import jwt from 'jsonwebtoken'


export const signup = async (req,res)=>{
    try {
        const {fullName,email,password} = req.body
    if(!fullName || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        })
    }
    if(password.length < 6){
        return res.status(400).json({
            message:"password must me more than 6 characters"
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser  = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({
            message:"Email already exists, please use a different one"
        })
    }
    const index = Math.floor(Math.random() *100) +1
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`
    
    const newUser = await User.create({
        fullName,
        email,
        password,
        profilePic: randomAvatar
    })

    // create a user in STREAM 
    try {
        await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.profilePic || ""
        })
        console.log(`stream user created for ${newUser.fullName}`)
    } catch (error) {
      console.log('error in creating stream user',error)   
    }

    const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000 ,         //7days
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV ==="production"

    })

    res.status(201).json({
        success:true,
        user: newUser,
        message:"user created successfully"
    })
    } catch (error) {
      console.log('error in signup controller',error);
      res.status(500).json({
        message:"internal server error"
      })
        
    } 

}

export const login = async (req,res)=>{
  try {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message:"all fields are required"
        })
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(401).json({
            message:"invalid email or password"
        })
    }
    const isPasswordCorrect = await user.matchPassword(password)
    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"password is invalid"   
        })
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000 ,         //7days
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV ==="production"

    })

    res.status(200).json({
        statusCode:200,
        message:"user logged in succesfully",
        user : user
    })

  } catch (error) {
    console.log("error in login controller",error.message)
    res.status(500).json({
        statusCode:500,
        message:"internal server error"
    })
  }
}

export const logout = async (req,res)=>{
    res.clearCookie("jwt")
    res.status(200).json({
        statusCode:200,
        message:"logout succesfully"
    })
}

export const onboard  = async(req,res)=>{
   try {
      const userId = req.user
      const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body

      if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
        return res.status(400).json({
            statusCode:400,
            message:"all fields are required",
            missingFields:[
                !fullName && 'fullName',
                !bio && 'bio',
                !nativeLanguage && 'nativeLanguage',
                !location && 'location'

            ].filter(Boolean)
        })
      }

      const updatedUser = await User.findByIdAndUpdate(userId,{
        ...req.body,
        isOnboarded:true
      },{new:true})

      if(!updatedUser){
        return res.status(404).json({
            statusCode:404,
            message:"user not found"
        })
      }

      //update user info in stream (peding)
      try {
        await upsertStreamUser({
            id: updatedUser._id.toString(),
            name:updatedUser.fullName,
            image:updatedUser.profilePic || ""
        })
        console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
      } catch (error) {
        console.log('error updating stream user during onboarding',error);
        
      }

      res.status(200).json({
        statusCode:200,
        user:updatedUser
      })

   } catch (error) {
     console.log('error in onboarding controller',error)
     return res.status(500).json({
        statusCode:500,
        message:"internal server error"
     })
   }
}

export const authenticatedUser = async (req,res)=>{
    return res.status(200).json({
        statusCode:200,
        user: req.user
    })
}