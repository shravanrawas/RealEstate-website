import React from 'react'
import spinner from '../assets/svg/spinner.svg'

function Spiner() {
    return (
        <div className='bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-10'>
            <div>
                <img src={spinner} alt="loading" className='h-24' />
            </div>
        </div>
    )
}

export default Spiner
