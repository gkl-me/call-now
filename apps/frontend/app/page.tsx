'use client'

import { useEffect, useState } from "react"
import Room from "../components/Room"
import axios from "axios"

export default function Home(){

  const [joined,setJoined] = useState(false)
  const [name,setName] = useState('')
  const [userCount,setUserCount] = useState(0)

  useEffect(() => {
    async function getCount(){
      const count = await axios.get(process.env.NEXT_PUBLIC_BACKEND!)
      setUserCount(count.data.totalUsers)
    }
    getCount()
  },[])

  return (
    !joined ? (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4 py-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">Call Now</h1>
          <h3 className="text-md sm:text-lg font-semibold text-center text-green-500 mb-4 sm:mb-6">Active Users: {userCount}</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Enter Your Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key=='Enter' && setJoined(true) }
            />
          </div>
          <button 
            onClick={() => setJoined(true)} 
            disabled={!name}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
          >
            Start Chat
          </button>
        </div>
      </div>
    ) : (
      <Room name={name} />
    )
  )
}