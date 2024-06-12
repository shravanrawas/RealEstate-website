import React, { useState } from 'react';
import Spiner from '../componant/spiner';
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getAuth } from 'firebase/auth';
import { app, db } from '../firebase';
import { v4 as uuidv4 } from 'uuid'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router';

function Createposts() {
    const [geolocationEnable, setgeolocationEnable] = useState(true);
    const [loading, setloading] = useState(false)
    const auth = getAuth(app)
    const navigate = useNavigate()
    const [formdata, setformdata] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathroom: 1,
        parking: false,
        furnished: false,
        address: '',
        description: '',
        offer: true,
        regularprice: 0,
        discountprice: 0,
        latitude: 0,
        longitude: 0,
        images: {},
    });

    const { type, name, longitude, latitude, offer, discountprice, regularprice, images, description, bedrooms, bathroom, parking, address, furnished } = formdata;

    const onChange = (e) => {
        let boolean = null;

        if (e.target.value === 'true') {
            boolean = true;
        }

        if (e.target.value === 'false') {
            boolean = false;
        }

        if (e.target.files) {
            setformdata((prev) => ({
                ...prev,
                images: e.target.files
            }));
        }

        if (!e.target.files) {
            setformdata((prev) => ({
                ...prev,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    };


    const onSubclick = async (e) => {
        e.preventDefault();
        setloading(true);
    
        try {
            if (+discountprice >= +regularprice) {
                setloading(false)
                toast.error('Discount price needs to be less than regular price');
                return;
            }
            if (images.length > 6) {
                toast.error('Maximum 6 images are allowed');
                return;
            }
    
            let geolocation = {};
            let location;
    
            if (geolocationEnable) {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
                const data = await response.json();
    
                if (data && data.length > 0) {
                    geolocation.lat = data[0]?.lat ?? 0;
                    geolocation.lng = data[0]?.lon ?? 0;
                    location = data[0]?.display_name;
                } else {
                    throw new Error('Invalid address');
                }
    
                if (!location || location.includes('undefined')) {
                    throw new Error('Please enter a correct address');
                }
            } else {
                geolocation.lat = latitude;
                geolocation.lng = longitude;
            }
    
            const storeImage = async (image) => {
                return new Promise((resolve, reject) => {
                    const storage = getStorage();
                    const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                    const storageRef = ref(storage, filename);
                    const uploadTask = uploadBytesResumable(storageRef, image);
    
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("Upload is " + progress + "% done");
                        },
                        (error) => reject(error),
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
                        }
                    );
                });
            };
    
            const imgUrls = await Promise.all([...images].map((image) => storeImage(image)));
            
            const formdatacopy = {
                ...formdata,
                imgUrls,
                geolocation,
                timestamp: serverTimestamp(),
                userRef: auth.currentUser.uid,
            };
            
            delete formdatacopy.images;
            !formdatacopy.offer && delete formdatacopy.discountprice;
            delete formdatacopy.latitude;
            delete formdatacopy.longitude;
    
            const docRef = await addDoc(collection(db, 'listings'), formdatacopy);
            toast.success('Listing created');
            navigate(`/category/${formdatacopy.type}/${docRef.id}`);
        } catch (error) {
            console.error('Error creating listing:', error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setloading(false);
        }
    };
    
   
    if (loading) {
        return <Spiner />
    }

    return (
        <main className='max-w-md px-2 mx-auto'>
            <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
            <form onSubmit={onSubclick}>
                <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
                <div className='flex'>
                    <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${type === 'rent' ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='type' value='sell' onClick={onChange}>Sell</button>
                    <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${type === 'sell' ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='type' value='rent' onClick={onChange}>Rent</button>
                </div>

                <p className='text-lg mt-6 font-semibold'>Name</p>
                <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' placeholder='Name' maxLength='32' minLength='10' required type="text" value={name} id='name' onChange={onChange} />
                <div className='flex space-x-6 mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>Beds</p>
                        <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-700 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center rounded' type="number" id='bedrooms' value={bedrooms} onChange={onChange} min='1' max='50' required />
                    </div>
                    <div>
                        <p className='text-lg font-semibold'>Baths</p>
                        <input className='w-full  px-4 py-2 text-xl text-gray-700 bg-white border border-gray-700 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center rounded' type="number" id='bathroom' value={bathroom} onChange={onChange} min='1' max='50' required />
                    </div>
                </div>

                <p className='text-lg mt-6 font-semibold'>Parking spot</p>
                <div className='flex'>
                    <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='parking' value={true} onClick={onChange}>Yes</button>
                    <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='parking' value={false} onClick={onChange}>No</button>
                </div>

                <p className='text-lg mt-6 font-semibold'>Furnished</p>
                <div className='flex'>
                    <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='furnished' value={true} onClick={onChange}>Yes</button>
                    <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='furnished' value={false} onClick={onChange}>No</button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Address</p>
                <textarea className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' placeholder='Address' required type="text" value={address} id='address' onChange={onChange} />
                {!geolocationEnable && (
                    <div className='flex space-x-6 justify-start mb-6'>
                        <div className=''>
                            <p className='text-lg font-semibold'>Latitude</p>
                            <input min='-90' max='90' className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" id='latitude' value={latitude} onChange={onChange} required />
                        </div>
                        <div className=''>
                            <p className='text-lg font-semibold'>Longitude</p>
                            <input min='-100' max='100' className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" id='longitude' value={longitude} onChange={onChange} required />
                        </div>
                    </div>
                )}

                <p className='text-lg  font-semibold'>Description</p>
                <textarea className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' placeholder='Description' required type="text" value={description} id='description' onChange={onChange} />

                <p className='text-lg  font-semibold'>Offer</p>
                <div className='flex mb-6'>
                    <button className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='offer' value={true} onClick={onChange}>Yes</button>
                    <button className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`} type='button' id='offer' value={false} onClick={onChange}>No</button>
                </div>

                <div className='flex items-center mb-6'>
                    <div className=''>
                        <p className='text-lg font-semibold'>Regular price</p>
                        <div className='flex w-full justify-center items-center space-x-6'>
                            <input type="number" id='regularprice' className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300  rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' value={regularprice} onChange={onChange} required min='50' max='50000000' />
                            {type === 'rent' && (
                                <div>
                                    <p className='text-md w-full whitespace-nowrap'>$ / Months</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                {offer && (
                    <div className='flex items-center mb-6'>
                        <div className=''>
                            <p className='text-lg font-semibold'>Discounted Price</p>
                            <div className='flex w-full justify-center items-center space-x-6'>
                                <input type="number" id='discountprice' required={offer} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300  rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' value={discountprice} onChange={onChange} min='50' max='50000000' />
                                {type === 'rent' && (
                                    <div>
                                        <p className='text-md w-full whitespace-nowrap'>$ / Months</p>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}
                <div className='mb-6'>
                    <p className='text-lg font-semibold'>Images</p>
                    <p className='text-gray-600'>The first image will be the cover (max 6)</p>
                    <input className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600' type="file" id='images' onChange={onChange} accept=' .jpg, .png, .jpeg' multiple required />
                </div>
                <button className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150' type='submit'>Create Listing</button>
            </form>
        </main>
    );
}

export default Createposts;
