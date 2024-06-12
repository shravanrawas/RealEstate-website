import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase'
import Spiner from '../componant/spiner'
import ListingItem from '../componant/Listingitem'

function Offers() {

  const [listings, setlistings] = useState(null)
  const [loading, setloading] = useState(true)
  const [lastfetch, setlastfetchlisting] = useState(null)

  useEffect(() => {
    const fetchlisting = async () => {
      try {
        const listingRef = collection(db, 'listings')
        const q = query(listingRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(8))
        const docsnap = await getDocs(q)
        const lastvisible = docsnap.docs[docsnap.docs.length - 1]
        setlastfetchlisting(lastvisible)
        const listing = [];
        docsnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setlistings(listing)
        setloading(false)
      }
      catch (error) {
        toast.error('could not fetch listing')
      }
    }
    fetchlisting()
  }, [])

  const onFetchmore = async () => {
    try {
      const listingRef = collection(db, 'listings')
      const q = query(listingRef, where('offer', '==', true), orderBy('timestamp', 'desc'), startAfter(lastfetch) ,limit(4))
      const docsnap = await getDocs(q)
      const lastvisible = docsnap.docs[docsnap.docs.length - 1]
      setlastfetchlisting(lastvisible)
      const listing = [];
      docsnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setlistings((prev)=> [...prev, ...listing])
      setloading(false)
    }
    catch (error) {
      toast.error('could not fetch listing')
    }
  }

  return (
    <div className='max-w-full mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Offers</h1>
      {loading ? (
        <Spiner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 mt-6'>
              {listings.map((listing) => (
                <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
              ))}
            </ul>
          </main>
          {lastfetch && (
            <div className='flex justify-center items-center'>
              <button onClick={onFetchmore} className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 text-center rounded hover:border-slate-600 transition duration-150 ease-in-out'>See more</button>
            </div>
          )}
        </>
      ) : (
        <p className='text-center text-xl text-gray-700 mt-6 pb-6'>There are no current offers</p>
      )} 
    </div>
  );

}
 export default Offers