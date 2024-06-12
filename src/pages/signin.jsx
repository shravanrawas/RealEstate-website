import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Oauth from '../componant/Oauth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { app } from '../firebase';

function Signin() {
  const navigate = useNavigate()
  const [formdata, setformdata] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); 

  const { email, password } = formdata;

  const onChange = (e) => {
    setformdata((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handelsignin = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        navigate('/');
        toast.success('Sign in successful');
      }
    } catch (error) {
      toast.error('Wrong user information');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img
            className='w-full rounded-2xl'
            src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='key'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={handelsignin}>

            <input
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Enter your email'
            />

            <div className='mb-6'>
              <input
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
                type='password'
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Enter your password'
              />
            </div>

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6 '>Don't have an account?
                <Link className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1' to='/sign-up'> Register</Link></p>

              <p>
                <Link className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out' to='/forgot-password'>
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800'
              type='submit'
              disabled={loading} 
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>
            <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300
           after:border-t  after:flex-1  after:border-gray-300
          '>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <Oauth />
          </form>
        </div>
      </div>
    </section>
  );
}

export default Signin;
