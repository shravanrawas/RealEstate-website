import React, { useEffect, useState } from 'react';
import Slider from '../componant/slider';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Spiner from '../componant/spiner';
import { Link } from 'react-router-dom';
import ListingItem from '../componant/Listingitem';


function Home() {

  const [offerlisting, setofferlisting] = useState(null)
  const [rentlisting, setrentlisting] = useState(null)
  const [selllisting, setselllisting] = useState(null)

  useEffect(() => {
    const fetofferlisting = async () => {
      try{
         const listingRef = collection(db, 'listings')
         const q = query(listingRef, where('offer', '==' , true ), orderBy('timestamp', 'desc'), limit(4))
         const docsnap = await getDocs(q)
         const listings = [];
         docsnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data()
            })
         })
         setofferlisting(listings)
      }
      catch (error){
        console.log(error)
      }
    }
    fetofferlisting()
  }, [])

  useEffect(() => {
    const fetrentlisting = async () => {
      try{
         const listingRef = collection(db, 'listings')
         const q = query(listingRef, where('type', '==' , 'rent' ), orderBy('timestamp', 'desc'), limit(4))
         const docsnap = await getDocs(q)
         const listings = [];
         docsnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data()
            })
         })
         setrentlisting(listings)
      }
      catch (error){
        console.log(error)
      }
    }
    fetrentlisting()
  }, [])

  useEffect(() => {
    const fetselllisting = async () => {
      try{
         const listingRef = collection(db, 'listings')
         const q = query(listingRef, where('type', '==' , 'sell' ), orderBy('timestamp', 'desc'), limit(4))
         const docsnap = await getDocs(q)
         const listings = [];
         docsnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data()
            })
         })
         setselllisting(listings)
      }
      catch (error){
        console.log(error)
      }
    }
    fetselllisting()
  }, [])

  return (
    <div>
      <Slider />
      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
        
        {offerlisting && offerlisting.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Recent offers</h2>
            <Link to='/offers'>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more offers</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'>
              {offerlisting.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
        )}

        {rentlisting && rentlisting.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for rent</h2>
            <Link to='/category/rent'>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more places for rent</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'>
              {rentlisting.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
        )}

        {selllisting && selllisting.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for sell</h2>
            <Link to='/category/sell'>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more places for sell</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'>
              {selllisting.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;
