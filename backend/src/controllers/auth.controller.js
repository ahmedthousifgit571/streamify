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

    // create a user in STREAM as well (pending)

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
  } catch (error) {
    
  }
}

export const logout = async (req,res)=>{
    res.send("logout route")
}