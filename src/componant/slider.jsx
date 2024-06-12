import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Spiner from './spiner';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

function Slider() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingRef = collection(db, 'listings');
                const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);
                let listings = [];
                querySnapshot.forEach((doc) => {
                    listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setListings(listings);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching listings: ", error);
            }
        };
        fetchListing();
    }, []);

    if (loading) {
        return <Spiner />;
    }

    if (listings.length === 0) {
        return <></>;
    }

    return (
        listings && (
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                effect='fade'
                navigation
                pagination={{ clickable: true}}
                autoplay={{ delay: 3000 }}
            >
                {listings.map(({ data, id }) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div
                            style={{ background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover' }}
                            className='w-full h-[300px] overflow-hidden relative'
                        ></div>
                        <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl'>{data.name}</p>
                        <p className='text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl'>${data.discountprice ?? data.regularprice}
                        {data.type === 'rent' && ' / month'}
                        </p>
                    </SwiperSlide>
                ))}
            </Swiper>
        )
    );
}

export default Slider;
