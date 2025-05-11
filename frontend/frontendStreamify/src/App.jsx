import appRouter from "./Routes/routes"
import {RouterProvider} from 'react-router'

function App() {

  
  return (
    <RouterProvider router={appRouter} />
  )
}

export default App
