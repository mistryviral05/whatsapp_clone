import React from 'react'

const ChannelsSection = () => {
  return (
   <>
   <div className='bg-custom-darkchat h-[94vh] w-[45vw] border-r border-gray-700 text-white flex flex-col '>

   <div className='top bg-[#111b21] w-full flex items-start justify-between py-3 px-5 '>
        <div><h1 className='font-bold text-2xl'>Channels</h1></div>
        <div className='flex items-center  gap-7'>

          {/* Apply custom filter for gray color */}
          <div className=''>
            <img
              className='invert'
              src='/pluse.svg'
              alt='New Chat Icon'
            />
          </div>
          
        </div>


      </div>

      <div className='mid flex justify-center mt-2'>


        <div className='flex flex-col justify-center gap-3'>
          <h2 className='text-center text-xl'>Stay updated on your favourite topic</h2>
          <h3 className='text-center text-base text-gray-400'>Find channels to follow below</h3>
        </div>


      </div>


      <div className='button flex justify-center '>
        <div>
          <button className='bg-[#00a884] text-black rounded-full py-2 px-6 mt-5 hover:bg-[#06cf9c]'>Discover more</button>
        </div>

      </div>






   </div>
   </>
  )
}

export default ChannelsSection
