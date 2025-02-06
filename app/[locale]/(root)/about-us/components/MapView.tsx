'use client'

const MapView = () => {
  return (
    <div className='w-full text-center min-h-[600px] flex flex-col'>
      <h2 className='text-4xl font-bold text-center mb-8 text-gray-800 relative'>
        <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
          Our Location
        </span>
        <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
      </h2>
      <div className='w-full flex-1 rounded-lg overflow-hidden shadow-lg'>
        <div className='relative w-full h-full min-h-[550px]'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2910.291019209925!2d-79.17153929999999!3d43.1614151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d35105b21c2b5d%3A0x40ad75af00dc093e!2sPrima%20Wrap!5e0!3m2!1sen!2sca!4v1738799916666!5m2!1sen!2sca'
            style={{
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
        </div>
      </div>
    </div>
  )
}

export default MapView
