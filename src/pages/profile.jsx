import { getAuth, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { app, db } from '../firebase';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import Listingitem from '../componant/Listingitem';

function Profile() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [changedetails, setchangedetails] = useState(false);
  const [listings, setlistings] = useState(null);
  const [loading, setloading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [formdata, setformdata] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formdata;

  const handellogout = () => {
    auth.signOut();
    navigate('/');
  };

  const handelEdit = (e) => {
    setformdata((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success('Profile detail updated');
    } catch (err) {
      toast.error('Could not Edit profle details');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileImageUrl(docSnap.data().profilePictureUrl);
      } else {
        console.log('No such document!');
      }
    };

    fetchUserProfile();
  }, [auth.currentUser.uid]);

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingref = collection(db, 'listings');
      const q = query(listingref, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
      const querysnap = await getDocs(q);
      let listings = [];
      querysnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setlistings(listings);
      setloading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = listings.filter((listing) => listing.id !== listingId);
      setlistings(updatedListings);
      toast.success('Listing deleted successfully');
    }
  };

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-4'>
          <form>
            <div className='p-[30px,20px] flex flex-col items-center border-b pb-7'>
              <img
                src={profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                className='w-[100px] h-[100px] rounded-[50%] object-cover flex justify-center items-center'
                alt='Profile'
              />
            </div>

            <input
              className={`w-full mb-6 text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changedetails && 'bg-red-200 focus:bg-red-300'
              }`}
              type='text'
              id='name'
              value={name}
              disabled={!changedetails}
              onChange={handelEdit}
            />

            <input
              className='w-full mb-6 text-xl px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
              type='email'
              id='email'
              value={email}
              disabled
            />

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p className='flex items-center mb-6'>
                Do you want to change your name?
                <span
                  onClick={() => {
                    changedetails && onSubmit();
                    setchangedetails((prev) => !prev);
                  }}
                  className='text-red-600 ml-1 hover:text-red-700 transition duration-200 ease-in-out cursor-pointer'
                >
                  {changedetails ? 'Apply changes' : 'Edit'}
                </span>
              </p>
              <p onClick={handellogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>
                Sign out
              </p>
            </div>
          </form>
          <button
            className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800'
            type='submit'
          >
            <Link className='flex justify-center items-center' to='/create-listing'>
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2 ' />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && (
          <>
            {listings && listings.length > 0 ? (
              <>
                <h2 className='text-2xl text-center font-semibold mb-6'>My Listings</h2>
                <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
                  {listings.map((listing) => (
                    <Listingitem key={listing.id} id={listing.id} listing={listing.data} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
                  ))}
                </ul>
              </>
            ) : (
              <p className='text-center text-2xl mt-2 pb-6'>No listings available</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
