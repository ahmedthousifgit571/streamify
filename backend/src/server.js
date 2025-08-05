import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'


dotenv.config()

const PORT = process.env.PORT

// Cross-platform way to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
app.use(cors({
    origin:["http://localhost:5173", "https://streamify-p7e2.vercel.app"],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())




app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, "../../frontend/frontendStreamify/dist")
    const indexPath = path.join(__dirname, "../../frontend/frontendStreamify/dist/index.html")
    
    console.log("Current __dirname:", __dirname)
    console.log("Static files path:", staticPath)
    console.log("Index.html path:", indexPath)
    
    // Check if files exist
    console.log("Static path exists:", existsSync(staticPath))
    console.log("Index.html exists:", existsSync(indexPath))
    
    app.use(express.static(staticPath))
    
    // Catch all handler: send back React's index.html file for any non-API routes
    app.get("*", (req, res) => {
        res.sendFile(indexPath)
    })
}


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB()
})

