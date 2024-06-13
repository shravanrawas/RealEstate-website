import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Header() {

  const [pagestate, setpagestate] = useState('Sign in')
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setpagestate('Profile')
      }
      else {
        setpagestate('Sign in')
      }
    })
  }, [auth])

  const location = useLocation()
  const navigate = useNavigate()
  const pathMatch = (route) => {
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>

        <div>
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>Home<span className='text-red-700'>Flow</span></h1>
        </div>

        <div>
          <ul className='flex space-x-10'>

            <Link to='/'>
              <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] 
                border-b-transparent ${pathMatch('/') && 'text-black border-b-red-600'}`}>Home</li>
            </Link>

            <Link to='/offers'>
              <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] 
                border-b-transparent ${pathMatch('/offers') && 'text-black border-b-red-600'}`}>Offers</li>
            </Link>

            <Link to='/profile'>
              <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] 
                border-b-transparent ${(pathMatch('/sign-in') || pathMatch('/profile')) && 'text-black border-b-red-600'}`}>
                {pagestate}
              </li>
            </Link>

          </ul>
        </div>
      </header>
    </div>
  )
}

export default Header
