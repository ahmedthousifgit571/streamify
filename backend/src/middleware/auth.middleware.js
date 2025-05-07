import jwt from 'jsonwebtoken'
import users from '../models/Users.js'

export const protectedRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decoded){
            return res.status(401).json({
                statusCode:401,
                message:"Unauthorized - no token provided"
            })
        }
        const user = await users.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({
                statusCode:401,
                message:"Unauthorized - user not found"
            })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Unauthorized - " + (error.message || "authentication failed")
          });
    }
}