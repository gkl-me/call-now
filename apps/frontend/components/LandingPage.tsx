import React, {  useEffect, useState } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import axios from 'axios';

interface LandingPageProps {
  username: string;
  setUsername: (username: string) => void;
  onStart: () => void;
}

export function LandingPage({ username, setUsername, onStart }: LandingPageProps) {

   const [userCount,setUserCount] = useState(0);

   useEffect(() => {
    const fetchUserCount = async () => {
      const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND || "http://localhost:3001");
      const data = response.data.totalUsers;
      setUserCount(data);
    };

    fetchUserCount();
   },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <MessageCircle className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Random Chat
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Connect with random people around the world
        </p>
        <div className="flex items-center justify-center space-x-2 mb-8 bg-indigo-50 py-2 px-4 rounded-lg">
          <Users className="w-5 h-5 text-indigo-600" />
          <span className="text-indigo-600 font-medium">
            {/* Simulated random number between 50-200 */}
            {userCount} users online
          </span>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
          <button
            onClick={onStart}
            disabled={!username.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Chatting
          </button>
        </div>
      </div>
    </div>
  );
}