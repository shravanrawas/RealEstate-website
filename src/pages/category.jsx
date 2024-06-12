import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Spiner from '../componant/spiner';
import ListingItem from '../componant/Listingitem';
import { useParams } from 'react-router-dom';

function Category() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(8)
        );
        const docSnap = await getDocs(q);
        const lastVisible = docSnap.docs[docSnap.docs.length - 1];
        setLastFetch(lastVisible);
        const listingsArray = [];
        docSnap.forEach((doc) => {
          listingsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listingsArray);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, [params.CategoryName]);

  const onFetchMore = async () => {
    try {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetch),
        limit(4)
      );
      const docSnap = await getDocs(q);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];
      setLastFetch(lastVisible);
      const listingsArray = [];
      docSnap.forEach((doc) => {
        listingsArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prev) => [...prev, ...listingsArray]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch more listings');
    }
  };

  return (
    <div className='max-w-full mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 font-bold'>
        {params.categoryName === 'rent' ? 'Places for Rent' : 'Places for Sell'}
      </h1>
      {loading ? (
        <Spiner />
      ) : listings.length > 0 ? (
        <>
          <main>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 mt-6'>
              {listings.map((listing) => (
                <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
              ))}
            </ul>
          </main>
          {lastFetch && (
            <div className='flex justify-center items-center'>
              <button
                onClick={onFetchMore}
                className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 text-center rounded hover:border-slate-600 transition duration-150 ease-in-out'
              >
                See More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className='text-center'>There are no current {params.categoryName === 'rent' ? 'places for rent' : 'places for sell'}</p>
      )}
    </div>
  );
}

export default Category;
