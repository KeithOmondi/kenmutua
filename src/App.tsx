import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { fetchMeThunk } from './store/slice/authSlice';
import HomePage from './pages/HomePage';
import type { AppDispatch } from './store/store';
import ProtectedRoute from './route/ProtectedRoutes';
import LoginPage from './pages/auth/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContact from './pages/admin/AdminContact';
import AdminGallery from './pages/admin/AdminGallery';
import AdminHero from './pages/admin/AdminHero';
import AdminStory from './pages/admin/AdminStory';
import AdminServices from './pages/admin/AdminServices';
import AdminCoverage from './pages/admin/AdminCoverage';

const router = createBrowserRouter([
  { path: '/',      element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  {
  element: <ProtectedRoute />,
  children: [
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'contact', element: <AdminContact /> },
        { path: 'gallery', element: <AdminGallery /> },
        { path: 'hero', element: <AdminHero /> },
        { path: 'story', element: <AdminStory /> },
        { path: 'service',  element: <AdminServices /> },
        { path: 'coverage',     element: <AdminCoverage /> },
      ],
    },
  ],
},
]);

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;