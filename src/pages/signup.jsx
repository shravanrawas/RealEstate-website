import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Oauth from '../componant/Oauth';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { app } from '../firebase';
import { db, storage } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { LuUpload } from "react-icons/lu";

function Signup() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    name: "",
    email: '',
    password: '',
    profilePicture: null,
  });
  const [labelText, setLabelText] = useState('Upload Profile'); 
  const [loading, setLoading] = useState(false); 

  const { name, email, password, profilePicture } = formdata;

  const onChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setformdata((prev) => ({
        ...prev,
        profilePicture: file,
      }));
      setLabelText('Selected'); 
    } else {
      setformdata((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const uploadProfilePicture = async (image) => {
    const storageRef = ref(storage, `profilePictures/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profilePictureUrl = '';
      if (profilePicture) {
        profilePictureUrl = await uploadProfilePicture(profilePicture);
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: profilePictureUrl,
      });

      const formdatacopy = { ...formdata };
      delete formdatacopy.password;
      delete formdatacopy.profilePicture;
      formdatacopy.profilePictureUrl = profilePictureUrl;
      formdatacopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formdatacopy);

      toast.success('Sign up was successful');
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong with registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img
            className='w-full rounded-2xl'
            src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='key'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={handelsubmit}>
            <input
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              type='text'
              id='name'
              value={name}
              onChange={onChange}
              placeholder='Full name'
            />
            <input
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Email address'
            />
            <input
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              type='password'
              id='password'
              value={password}
              onChange={onChange}
              placeholder='Password'
            />
            <label className='flex gap-2 mb-6 p-2 w-[150px] bg-blue-500 text-white rounded-lg shadow-lg cursor-pointer items-center hover:bg-blue-600 transition duration-300 ease-in-out' htmlFor="profilePicture">
              {labelText}<span className='text-xl'><LuUpload/></span>
            </label>
            <input
              style={{ display: 'none' }}
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              type='file'
              id='profilePicture'
              accept='image/*'
              onChange={onChange}
            />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>
                Have an account?{' '}
                <Link className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1' to='/sign-in'>
                  Sign in
                </Link>
              </p>
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
              {loading ? 'Loading...' : 'Sign up'}
            </button>
            <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <Oauth />
          </form>
        </div>
      </div>
    </section>
  );
}

export default Signup;
