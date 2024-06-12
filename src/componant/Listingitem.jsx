import React from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { MdLocationOn } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

function ListingItem({ listing, id, onDelete, onEdit}) {
    return (
        <li className='bg-white flex flex-col relative justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150  m-[10px]'>
            <Link className='contents' to={`/category/${listing.type}/${id}`}>
                <img className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in' loading='lazy' src={listing.imgUrls[0]} alt="Listing" />
                {listing.timestamp ? (
                    <TimeAgo className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg' date={listing.timestamp.toDate()} />
                ) : (
                    <span>No Date Available</span>
                )}
                <div className='w-full p-[10px]'>
                    <div className='flex items-center space-x-1'>
                        <MdLocationOn className='h-4 w-4 text-green-600' />
                        <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
                    </div>
                    <p className='font-semibold m-0 text-xl truncate'>{listing.name}</p>
                    <p className='text-[#457b9d] mt-2 font-semibold'>$ {listing.offer ? listing.discountprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {listing.type === 'rent' && ' / month'}
                    </p>
                    <div className='flex items-center mt-[10px] space-x-3'>
                        <div className='flex items-center space-x-1'>
                            <p className='font-bold text-xs'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds`: '1 Bed'}</p>
                        </div>
                        <div className='flex items-center space-x-1'>
                             <p className='font-bold text-xs'>{listing.bathroom > 1 ? `${listing.bathroom} Baths` : '1 Bath'}</p>
                        </div>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <FaTrash className='absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-100 hover:text-red-500 transition duration-200 ease-in-out' onClick={()=>onDelete(listing.id)}/>
            )}
            {onEdit && (
                 <MdEdit className='absolute bottom-2 right-7 h-4 cursor-pointer text-blue-100 hover:text-blue-500 transition duration-200 ease-in-out' onClick={()=>onEdit(listing.id)}/> 
            )}
        </li>
    );
}

export default ListingItem;
