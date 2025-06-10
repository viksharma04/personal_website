import React from 'react'
import Link from 'next/link'

const FullTerminal = () => {
  return (
    <main>
        <div className='bg-gray-900 w-full h-screen scanlines py-6 text-xl'>
            <Link href={'#'} className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4'>
                {'>'} About
            </Link>
            <Link href={'#'} className='text-green-500 drop-shadow-[0_0_0.6px_#00FF00] hover:underline px-4'>
                {'>'} Projects
            </Link>
        </div>
    </main>
  )
}

export default FullTerminal