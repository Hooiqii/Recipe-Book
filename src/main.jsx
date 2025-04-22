import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";

import './main.css'

import Home, { loader as HomeLoader } from './routes/Home.jsx'
import RecipeDetail from './components/recipeDetail.jsx' 

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    loader: HomeLoader,
  },
  {
    path: "/recipes/:id", 
    Component: RecipeDetail, 
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
