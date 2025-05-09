import {createBrowserRouter} from 'react-router-dom'
import HomePage from '../pages/HomePage.jsx'
import SignUpPage from '../pages/SignUpPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'

const appRouter = createBrowserRouter([
    {
    path:"/",
    element: <HomePage />
    },
    {
      path:"/signup",
      element: <SignUpPage />
    },
    {
      path:"/login",
      element: <LoginPage />
    }
])

export default appRouter
