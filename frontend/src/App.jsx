import React from 'react'
import RootLayout from './components/RootLayout'
import {createBrowserRouter, RouterProvider} from 'react-router'
import Home from './components/Home'
import AddUser from './components/AddUser'
import UsersList from './components/UsersList'
import User from './components/User'

function App() {
  const routerObj = createBrowserRouter([
    {
      path:"/",
      element: <RootLayout/>,
      children:[
        {
          path:"",
          element: <Home/>
        },
        {
          path:"add-user",
          element: <AddUser/>
        },
        {
          path:"users-list",
          element: <UsersList/>
        },
        {
          path:"user",
          element: <User/>
        }
      ]
    }
  ])
  return <RouterProvider router={routerObj} />
}

export default App