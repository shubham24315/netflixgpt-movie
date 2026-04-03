import React from 'react'
import Login from './Login'
import Browse from './Browse'
import Header from './Header'
import MoviePage from './MoviePage'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

const BrowseLayout = () => (
  <div className="min-h-screen bg-black">
    <Header />
    <Outlet />
  </div>
)

const Body = () => {
    const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/Browse",
        element: <BrowseLayout />,
        children: [
          { index: true, element: <Browse /> },
          { path: "movie/:movieId", element: <MoviePage /> },
        ],
    },
]);


  return (
    <div>
     <RouterProvider router={appRouter}/>
    </div>
  )
}

export default Body