import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PageLoader from './components/PageLoader.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import OnboardingPage from './pages/OnboardingPage.jsx';

// Create a QueryClient instance
const queryClient = new QueryClient();

function AppContent() {
   const {isLoading,authUser} = useAuthUser()  // custom hook Authentication query

   const isAuthenticated = Boolean(authUser)
   const isOnboarded = authUser?.isOnboarded

  if (isLoading) {
    return <PageLoader />;
  }
  
  // Route configuration with auth checks
  const router = createBrowserRouter([
    {
      path: '/',
      element:  (isAuthenticated && isOnboarded ? (
        <HomePage />
      ) : (
        <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
      ))
    },
    {
      path: '/signup',
      element:  (!isAuthenticated ?<SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding" } />  )
    },
    {
      path: '/login',
      element:  (!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding" } />  )
    },
    {
      path: '/notifications',
      element: ( isAuthenticated ? <NotificationsPage /> : <Navigate  to="/login"/>)
    },
    {
      path: '/call',
      element: ( isAuthenticated ? <CallPage /> : <Navigate  to="/login"/>)
    },
    {
      path: '/chat',
      element: ( isAuthenticated ? <ChatPage /> : <Navigate  to="/login"/>)
    },
    {
      path: '/onboarding',
      element: ( isAuthenticated ? (
        !isOnboarded ? (
          <OnboardingPage />
        ) : (
          <Navigate to="/"/>
        )
      ) : (
        <Navigate to="/login"/>
      ))
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