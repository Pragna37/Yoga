import React, { use } from 'react'

import { useNavigate } from 'react-router-dom'
const Navbar = () => {

    const navigate = useNavigate();
  return (
    <div className='w-full flex justify-end items-center p-4 bg-gray-800 text-white'>
      
      <button onClick ={()=>navigate('/login')}className='flex items-center gap-2 border border-gray-500 rounded-full px-6 text-gray-800 hover: bg-gray-100 transition-all'>login</button>
    </div>
  )
}

export default Navbar
