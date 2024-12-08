import React from 'react'

const StatusSection = () => {
  return (
    <>
    <div className='bg-custom-dark h-[94vh] w-[45vw] border-r  border-gray-700 text-white flex flex-col '>
      
      <div className='top bg-[#111b21] w-full flex items-start justify-between py-3 px-5 h-1/4'>
        <div><h1 className='font-bold text-2xl'>Status</h1></div>
        <div className='flex items-center  gap-7'>

          {/* Apply custom filter for gray color */}
          <div className=''>
            <img
              className='invert'
              src='/pluse.svg'
              alt='New Chat Icon'
            />
          </div>
          <div>
            <img
              className='invert'
              src='/menu.svg'
              alt='Menu Icon'
            />
          </div>
        </div>


      </div>

      <div className='bg-[#111b21] w-full flex flex-col mt-2 h-full' >

        <div className='px-6 pt-10'>

          <div className='text-green-700'>VIEWED</div>



        </div>

        <div className='py-7'>

          <div className='flex items-center justify-center gap-1'>
            <span><img className='invert' src='/lock.svg'/></span>
            <span className='text-xs'>Your status updates are </span>
            <span className='text-xs text-blue-400 cursor-pointer'>end-to-end encrypted</span>
          </div>
        </div>



      </div>
      </div>
      
    
      
       
        





    </>
  )
}

export default StatusSection
