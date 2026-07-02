import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';

/**
 * App — root component that mounts the React Router provider.
 * All layouts and providers are managed through the router configuration.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
