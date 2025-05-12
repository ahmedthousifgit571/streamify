import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

// Create a QueryClient instance
const queryClient = new QueryClient();

function AppContent() {
  // Authentication query
  const {
    data: authData,
    error
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false
  });

  // Determine if user is authenticated
  const authUser = authData?.user;

  
  // Route configuration with auth checks
  const router = createBrowserRouter([
    {
      path: '/',
      element:  (authUser ? <HomePage /> : <Navigate to="/login" />)
    },
    {
      path: '/signup',
      element:  (!authUser ?<SignUpPage /> :<Navigate to="/" />  )
    },
    {
      path: '/login',
      element:  (!authUser ? <LoginPage /> : <Navigate to="/" />  )
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  // Render the router provider with our configured routes
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;