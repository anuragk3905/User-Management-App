import React from 'react'
import RootLayout from './components/RootLayout'
import {createBrowserRouter, RouterProvider} from 'react-router'
import AddUser from './components/AddUser'
import EditUser from './components/EditUser'
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
          element: <UsersList/>
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
          path:"user/:id",
          element: <User/>
        },
        {
          path:"edit-user/:id",
          element: <EditUser/>
        }
      ]
    }
  ])
  return <RouterProvider router={routerObj} />
}

export default App