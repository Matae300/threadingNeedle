import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import Home from './pages/Home.jsx'
import Thread from './pages/Thread.jsx'
import Profile from './pages/Profie.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Problem displaying page!</h1>,
    children: [
      {
        index: true,
        element: <Home />
      }, 
      {
        path: '/thread/:id',
        element: <Thread />
      }, 
      {
        path: '/profile',
        element: <Profile />
      }, 
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
