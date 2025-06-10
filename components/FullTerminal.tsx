import React from 'react';
import Link from 'next/link';
import { CloseBox } from '@nsmr/pixelart-react';

const FullTerminal = () => {
  return (
    <main className='bg-black border-2 border-green-500 font-terminal w-full h-screen scanlines p-2'>
      <div className='flex justify-between items-center'>
        <div className='py-6 text-xl md:text-4xl flex'>
            <Link href={'#'} className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker'>
                {'>'} About
            </Link>
            <Link href={'#'} className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker'>
                {'>'} Projects
            </Link>
            <Link href={'#'} className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4 flicker'>
                {'>'} Contact
            </Link>
        </div>
        <Link href={'/'} className='cursor-pointer text-green-500 drop-shadow-[0_0_0.6px_#00FF00] px-4 md:scale-200'>
          <CloseBox size={24} className='hover:scale-120'/> 
        </Link>
      </div>
        
    </main>
  )
}

export default FullTerminal