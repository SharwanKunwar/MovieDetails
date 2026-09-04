
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ActionPage from './pages/ActionPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { ThemeProvider } from './theme/ThemeContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        index: true,
        element: <Dashboard />
      },
      {
        path: '/action',
        element: <ActionPage />
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
)
