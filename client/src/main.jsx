import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RandomCall from './pages/RandomCall.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Home from './pages/Home.jsx'

const router = createBrowserRouter([
  {
    path : "/",
    // errorElement : <Error />,
    element : <App />,
    children : [
      {
        path: "/",
        element : <Home />
      },
      {
        path : "/call",
        element : <RandomCall />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
