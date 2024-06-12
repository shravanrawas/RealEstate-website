import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import Signin from "./pages/signin"
import Signup from "./pages/signup"
import Offers from "./pages/offers"
import Profile from './pages/profile'
import Header from "./componant/header"
import Forgot from "./pages/forgot"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Privateroute from "./componant/privateroute"
import Createposts from "./pages/createposts"
import Editlisting from "./pages/editlisting"
import Listing from "./pages/listing"
import Category from "./pages/category"


function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Privateroute/>}>
            <Route path="/profile" element={<Profile/>} />
          </Route>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/offers" element={<Offers />}/>
          <Route path="/category/:categoryName/:listingId" element={<Listing/>}/>
          <Route path="/category/:categoryName" element={<Category/>}/>

          <Route path="create-listing" element={<Privateroute/>}>
            <Route path="/create-listing" element={<Createposts/>}/>
          </Route> 

          <Route path="edit-listing" element={<Privateroute/>}>
            <Route path="/edit-listing/:listingId" element={<Editlisting/>}/>
          </Route> 

        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
      
    </>
  )
}

export default App
