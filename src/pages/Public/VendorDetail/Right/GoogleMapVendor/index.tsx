import React from 'react'

const GoogleMapVendor = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5707926371033!2d106.78003987512413!3d10.84412148930882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527cc0b521d71%3A0x2384e63af1f7dbab!2zVG9ueSBXZWRkaW5nIC0gQ2jhu6VwIOG6o25oIGPGsOG7m2kgxJHhurlwIFRo4bunIMSQ4bupYw!5e0!3m2!1svi!2s!4v1744605941092!5m2!1svi!2s"
      width="385"
      height="300"
      className='rounded-md my-5 shadow-sm'
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade">
    </iframe>
  )
}

export default GoogleMapVendor